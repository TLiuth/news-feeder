import { Controller, Get, Post, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { IngestNewsDto } from './dto/IngestNewsDto';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post('ingest')
    async ingestNews(
        // @Query('country') country?: string,  // ! Substituídos pelo dto
        // @Query('theme') theme?: string,
        // @Query('dryRun') dryRun?: string,
        @Query() ingestNewsDto: IngestNewsDto) {
        const { country, theme, dryRun } = ingestNewsDto;
        const result = await this.newsService.fetchAndStoreNews(theme, country, dryRun === 'true');
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
