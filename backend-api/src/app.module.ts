import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import { ThemesModule } from './modules/themes/themes.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/users/entities/user.entity';
import { ThemeEntity } from './modules/themes/entities/theme.entity';
import { ArticleEntity } from './modules/news/entities/article.entity';
import { SummaryEntity } from './modules/news/entities/summary.entity';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule available to all modules

    }),

    // Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? ""),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, ThemeEntity, ArticleEntity, SummaryEntity],
      // autoLoadEntities: true,
      synchronize: true, // Auto-create tables //! Must be false when in production
      logging: true,
      logger: 'advanced-console',
      maxQueryExecutionTime: 0,  // Log all queries regardless of time
      dropSchema: false,
    }),

    // Feature modules
    UsersModule, NewsModule, ThemesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
