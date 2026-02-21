import { ThemeEntity } from "src/modules/themes/entities/theme.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index} from "typeorm"


@Entity('articles')
@Index(['url', 'source'], { unique: true})
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Column()
    source: string

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

    @Column('text', { nullable: true})
    body: string

    @ManyToMany(() => ThemeEntity, (theme) => theme.articles)
    themes: ThemeEntity[]


}
