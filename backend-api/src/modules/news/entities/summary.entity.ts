import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn} from "typeorm"
import { ArticleEntity } from "./article.entity"

// Entity definition:
// id: unique
// s_body (summarized body): string
// bullet_points: json
// original_article: <article>
// processingStatus: (enum: pending, completed, failed)
// tokensUsed: number
// model: string
// createdAt: datetime

export enum ProcessingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('summaries')
export class SummaryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    s_body: string

    @Column("json")
    bullet_points: any

    @OneToOne(() => ArticleEntity)
    @JoinColumn()
    article: ArticleEntity

    @Column({
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.PENDING
    })
    processingStatus: ProcessingStatus

    @Column()
    tokensUsed: number

    @Column()
    model: string

    @CreateDateColumn()
    createdAt: Date
}
