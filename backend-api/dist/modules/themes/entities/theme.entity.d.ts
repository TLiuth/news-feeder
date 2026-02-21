import { ArticleEntity } from "src/modules/news/entities/article.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
export declare class ThemeEntity {
    id: number;
    name: string;
    users: UserEntity[];
    description: string;
    keywords: string[];
    isActive: boolean;
    articles: ArticleEntity[];
    createdAt: Date;
    updatedAt: Date;
}
