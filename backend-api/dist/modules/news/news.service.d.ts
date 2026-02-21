import { ArticleEntity } from './entities/article.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
export declare class NewsService {
    private articleRepository;
    private httpService;
    private configService;
    private readonly logger;
    constructor(articleRepository: Repository<ArticleEntity>, httpService: HttpService, configService: ConfigService);
    fetchAndStoreNews(theme?: string): Promise<number>;
    private buildTopHeadLinesUrl;
    private fetchFromNewsAPI;
    private normalizeArticle;
    getAllArticles(): Promise<ArticleEntity[]>;
}
