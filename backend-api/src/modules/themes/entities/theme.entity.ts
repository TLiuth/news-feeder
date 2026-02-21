import { ArticleEntity } from "src/modules/news/entities/article.entity"
import { UserEntity } from "src/modules/users/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn} from "typeorm"


// Entity definition
// id: unique
// name: string
// subscribers: list<users>
// description: string
// keywords: string[]
// isActive: boolean
// articles: manyToMany<articles>

@Entity('themes')
export class ThemeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @ManyToMany(() => UserEntity, (user) => user.themes)
    @JoinTable()
    users: UserEntity[]

    @Column("text")
    description: string

    @Column("json")
    keywords: string[]

    @Column({ default: true })
    isActive: boolean

    @ManyToMany(() => ArticleEntity, (article) => article.themes)
    @JoinTable()
    articles: ArticleEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
