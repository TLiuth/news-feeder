import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    ingestNews(country?: string, theme?: string, dryRun?: string): Promise<{
        success: boolean;
        data: {
            fetched: number;
            inserted: number;
            skipped: number;
            failed: number;
            dryRun: boolean;
        };
    }>;
    getAllArticles(): Promise<{
        articles: import("./entities/article.entity").ArticleEntity[];
    }>;
}
