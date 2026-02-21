import { ArticleEntity } from "./article.entity";
export declare enum ProcessingStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class SummaryEntity {
    id: number;
    s_body: string;
    bullet_points: any;
    article: ArticleEntity;
    processingStatus: ProcessingStatus;
    tokensUsed: number;
    model: string;
    createdAt: Date;
}
