import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    ingestNews(theme?: string): Promise<{
        success: boolean;
        data: number;
    }>;
    getAllArticles(): Promise<{
        articles: import("./entities/article.entity").ArticleEntity[];
    }>;
}
