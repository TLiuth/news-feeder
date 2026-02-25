import { ThemeEntity } from "src/modules/themes/entities/theme.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, ManyToOne} from "typeorm"
import { SummaryEntity } from "./summary.entity"


@Entity('articles')
@Index(['url', 'source_country'], { unique: true})
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { unique: true , nullable: true})
    worldNewsId: string

    @Column()
    url: string

    @Column({ nullable: true })
    source_country: string

    @Column()
    publishedAt: Date

    @Column()
    accessDate: Date

    @Column({ nullable: true })
    imageUrl: string

    @Column( { nullable: true })
    author: string

    @Column()
    headline: string

    @ManyToOne(() => SummaryEntity, (summary) => summary.article, { nullable: true })
    summary: string

    @Column('text', { nullable: true})
    body: string

    @Column({ nullable: true})
    sentiment: number

    @ManyToMany(() => ThemeEntity, (theme) => theme.articles)
    themes: ThemeEntity[]


}
