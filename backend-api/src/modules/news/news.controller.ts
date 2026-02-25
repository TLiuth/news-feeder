import { Controller, Get, Post, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post('ingest')
    async ingestNews(
        @Query('country') country?: string,
        @Query('theme') theme?: string,
        @Query('dryRun') dryRun?: string,
        ) {
        const result = await this.newsService.fetchAndStoreNews(theme, country, dryRun === "true",);
        return {
            success: true,
            data: result,
        };
    }

    @Get()
    async getAllArticles() {
        const articles = await this.newsService.getAllArticles(); 
        return { articles };
    }

}
