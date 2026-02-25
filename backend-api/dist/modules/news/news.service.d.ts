import { ArticleEntity } from './entities/article.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
type IngestResult = {
    fetched: number;
    inserted: number;
    skipped: number;
    failed: number;
    dryRun: boolean;
};
export declare class NewsService {
    private articleRepository;
    private httpService;
    private configService;
    private readonly logger;
    constructor(articleRepository: Repository<ArticleEntity>, httpService: HttpService, configService: ConfigService);
    fetchAndStoreNews(theme?: string, country?: string, dryRun?: boolean): Promise<IngestResult>;
    private buildWorldNewsSearchUrl;
    private fetchFromWorldNewsAPI;
    private normalizeArticle;
    getAllArticles(): Promise<ArticleEntity[]>;
}
export {};
