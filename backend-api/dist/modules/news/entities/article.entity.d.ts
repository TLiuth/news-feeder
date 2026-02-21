import { ThemeEntity } from "src/modules/themes/entities/theme.entity";
export declare class ArticleEntity {
    id: number;
    url: string;
    source: string;
    publishedAt: Date;
    accessDate: Date;
    imageUrl: string;
    author: string;
    headline: string;
    body: string;
    themes: ThemeEntity[];
}
