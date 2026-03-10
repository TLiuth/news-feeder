import { ThemeEntity } from "src/modules/themes/entities/theme.entity"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, DeleteDateColumn} from "typeorm"


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({ default: false })
    emailVerified: boolean

    @Column('json', {nullable: true})
    subscriptionPreference: any

    @Column({nullable: true})
    telephone: string

    @ManyToMany(() => ThemeEntity)
    themes: ThemeEntity[]

    @Column({ nullable: true })
    lastEmailSent: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
