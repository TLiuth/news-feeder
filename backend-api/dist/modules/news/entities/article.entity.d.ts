import { ThemeEntity } from "src/modules/themes/entities/theme.entity";
export declare class ArticleEntity {
    id: number;
    worldNewsId: string;
    url: string;
    source_country: string;
    publishedAt: Date;
    accessDate: Date;
    imageUrl: string;
    author: string;
    headline: string;
    summary: string;
    body: string;
    sentiment: number;
    themes: ThemeEntity[];
}
