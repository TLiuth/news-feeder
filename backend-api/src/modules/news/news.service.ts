import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

type NewsApiArticle = {
    source?: { name?: string};
    author?: string | null;
    title?: string | null;
    description?: string | null;
    url?: string | null;
    urlToImage?: string | null;
    publishedAt?: string | null;
    content?: string | null;
};

type NewsApiResponse = {
    status: 'ok' | 'error';
    totalResults?: number;
    articles?: NewsApiArticle[];
    message?: string;
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

    async fetchAndStoreNews(theme?: string) {
        try {
            const url = this.buildTopHeadLinesUrl(theme);
            const apiArticles = await this.fetchFromNewsAPI(url)

            let inserted = 0;

            for (const apiArticle of apiArticles) {
                const normalized = this.normalizeArticle(apiArticle);

                if (!normalized.url || !normalized.source || !normalized.headline) {
                    continue;
                }
                
                const existing = await this.articleRepository.findOne({
                    where: {
                        url: normalized.url,
                        source: normalized.source,
                    },
                });

                if (existing) {
                    continue;
                }

                const entity = this.articleRepository.create(normalized);
                await this.articleRepository.save(entity);
                inserted++;
            }

            this.logger.log(`News sync complete. Inserted: ${inserted}`);
            return inserted;

        } catch (error) {
            console.log("Error in fetchAndStore:", error);
            throw error;
        }
    }

    private buildTopHeadLinesUrl(theme?: string): string {
        const baseUrl = this.configService.get<string>('NEWS_API_BASE_URL') ?? '';
        const apiKey = this.configService.get<string>('NEWS_API_KEY') ?? '';
        const pageSize = this.configService.get<string>('NEWS_API_PAGE_SIZE') ?? '20';
        const country = this.configService.get<string>('NEWS_API_COUNTRY') ?? 'us';

        const params = new URLSearchParams({
            apiKey,
            pageSize,
            country,
        });

        if (theme?.trim()) {
            params.set('q', theme.trim());
        }

        return `${baseUrl}/top-headlines?${params.toString()}`
    }

    private async fetchFromNewsAPI(url: string): Promise<NewsApiArticle[]> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<NewsApiResponse>(url),
            );

            if (data.status !== 'ok') {
                throw new Error(data.message ?? "News API returned error status");
            }

            return data.articles ?? []
        } catch (error) {
            this.logger.error("Fetch Error from News API:", error);
            throw error;
        }
    }

    private normalizeArticle(apiArticle: any): Partial<ArticleEntity> {
        return {
            url: apiArticle.url ?? "",
            source: apiArticle.source?.name ?? "unknown",
            publishedAt: apiArticle.publishedAt
                ? new Date(apiArticle.publishedAt)
                : new Date(),
            accessDate: new Date(),
            imageUrl: apiArticle.urlToImage ?? '',
            author: apiArticle.author ?? 'unknown',
            headline: apiArticle.title ?? '(untitled)',
            body: apiArticle.content ?? apiArticle.description ?? '',
        };
    }

    public getAllArticles(): Promise<ArticleEntity[]> {
        return this.articleRepository.find()
    }
}
