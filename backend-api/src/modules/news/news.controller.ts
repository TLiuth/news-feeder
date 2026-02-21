import { Controller, Get, Post, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post('ingest')
    async ingestNews(@Query('theme') theme?: string) {
        const result = await this.newsService.fetchAndStoreNews(theme);
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
