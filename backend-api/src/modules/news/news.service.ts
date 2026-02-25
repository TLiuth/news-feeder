import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { BadGatewayException, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';


type WorldNewsArticle = {
    id: number;
    title?: string;
    text?: string;     
    url?: string;
    image?: string;          
    publish_date?: string;   
    authors?: string[];     
    language?: string;
    source_country?: string;
};

type WorldNewsApiResponse = {
    news: WorldNewsArticle[];
    available: number,
    offset: number,
    number: number
};

type IngestResult = {
    fetched: number;
    inserted: number;
    skipped: number;
    failed: number;
    dryRun: boolean;
}


@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async fetchAndStoreNews(theme?: string, country?: string, dryRun = false): Promise<IngestResult> {
        try {
            const url = this.buildWorldNewsSearchUrl(theme, country);
            const apiArticles = await this.fetchFromWorldNewsAPI(url)

            console.log(apiArticles)
            console.log(`news returned: ${apiArticles.length}`)

            const result: IngestResult = {
                fetched: apiArticles.length,
                inserted: 0,
                skipped: 0,
                failed: 0,
                dryRun: dryRun,
            }
           

            for (const apiArticle of apiArticles) {
                const normalized = this.normalizeArticle(apiArticle);
                console.log(normalized)

                if (!normalized.url  || !normalized.headline) {
                    result.skipped ++;
                    continue;
                }
                
                const existing = await this.articleRepository.findOne({
                    where: {
                        url: normalized.url,
                        worldNewsId: normalized.worldNewsId,
                    },
                });

                if (existing) {
                    result.skipped ++;
                    continue;
                }

                if (dryRun) {
                    result.inserted ++;
                    continue;
                }

                const entity = this.articleRepository.create(normalized);
                try {
                    await this.articleRepository.save(entity);
                    result.inserted ++;

                } catch (error) {
                    this.logger.log(`FetchAndStoreNews - Error: ${error}`)
                    result.failed ++
                    continue
                }
            }

            if (dryRun) {
                this.logger.log(`DryRun Mode: No news inserted. ${result.fetched} articles processed.`)
                return result
            }

            this.logger.log(`News sync complete. Inserted: ${result.inserted} - Failed or skipped: ${result.skipped + result.failed}`);
            return result;

        } catch (error) {
            this.logger.log("Error in fetchAndStore:", error);
            throw error;
        }
    }


    private buildWorldNewsSearchUrl(theme?: string, country?: string): string {
        const baseUrl = this.configService.get<string>('WORLD_NEWS_API_BASE_URL') ?? '';
        const apiKey = this.configService.get<string>('WORLD_NEWS_API_KEY') ?? '';
        const amountNumber = this.configService.get<string>('WORLD_NEWS_API_AMOUNT_NUMBER') ?? '20';
        const language = this.configService.get<string>('WORLD_NEWS_API_LANGUAGE') ?? "br";

        const params = new URLSearchParams({
            'api-key': apiKey,
            'number': amountNumber,
            'language': language,
        });

        if (theme?.trim()) {
            params.set('text', theme.trim());
        }

        if (country?.trim()) {
            params.set('source-country', country.trim());
        }

        if (!baseUrl || !apiKey) {
            throw new InternalServerErrorException("URL or API Key missing!")
        }
        
        const url = `${baseUrl}/search-news?${params.toString()}`;
        return url
    }

    private async fetchFromWorldNewsAPI(url: string): Promise<WorldNewsArticle[]> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<WorldNewsApiResponse>(url),
            );

            if (!data) {
                throw new BadGatewayException("World News API returned error status");
            }

            return data.news ?? []

        } catch (error: unknown) {
            if (error instanceof BadGatewayException || error instanceof ServiceUnavailableException) {
                throw error;
            } 

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if(!status) {
                    this.logger.error(`News API network error: ${error.code} ${error.message}`)
                    throw new ServiceUnavailableException("News provider unavailable (network/timeout)");
                }

                this.logger.error(`News API upstream error: HTTP ${status} - ${error.message}`);
                throw new BadGatewayException(`News provider returned HTTP ${status}`);
            }

            this.logger.error(`Unexpected fetch error: ${String(error)}`);
            throw new ServiceUnavailableException('Failed to fetch news from provider');
        }
    }

    private normalizeArticle(apiArticle: any): any {
        return {
            worldNewsId: apiArticle.id,
            url: apiArticle.url ?? "",
            publishedAt: apiArticle.publish_date
                ? new Date(apiArticle.publish_date)
                : new Date(),
            accessDate: new Date(),
            imageUrl: apiArticle.image ?? '',
            author: apiArticle.authors?.[0] ?? 'unknown',
            headline: apiArticle.title ?? '(untitled)',
            body: apiArticle.text ?? '',
            source_country: apiArticle.source_country,
        };
    }

    public getAllArticles(): Promise<ArticleEntity[]> {
        return this.articleRepository.find()
    }
}
