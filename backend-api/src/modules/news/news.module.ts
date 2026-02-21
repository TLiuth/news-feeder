import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { SummaryEntity } from './entities/summary.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, SummaryEntity]),
  HttpModule,
],
  providers: [NewsService],
  controllers: [NewsController]
})
export class NewsModule {}
