import { NewsService } from './news.service';
import { IngestNewsDto } from './dto/IngestNewsDto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    ingestNews(ingestNewsDto: IngestNewsDto): Promise<{
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
