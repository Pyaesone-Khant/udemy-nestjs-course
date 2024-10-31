import { MetaOption } from "src/meta-options/meta-option.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostStatus } from "./enums/postStatus.enum";
import { PostType } from "./enums/postType.enum";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    title: string;

    @Column({
        type: "enum",
        enum: PostType,
        nullable: false,
        default: PostType.POST
    })
    postType: PostType;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    slug: string;

    @Column({
        type: "enum",
        enum: PostStatus,
        nullable: false,
        default: PostStatus.DRAFT
    })
    status: PostStatus;

    @Column({
        type: "text",
        nullable: true
    })
    content?: string;

    @Column({
        type: "json",
        nullable: true
    })
    schema?: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 1024
    })
    featuredImageUrl?: string;

    @Column({
        type: "timestamp",
        nullable: true
    })
    publishOn?: Date;

    @ManyToOne(
        () => User,
        (user) => user.posts,
        {
            cascade: true,
            eager: true
        }
    )
    author: User;

    tags?: string[];

    // OneToOne relation with MetaOption (Bi-directional)
    @OneToOne(
        () => MetaOption,
        (metaOptions) => metaOptions.post,
        {
            cascade: true,
            eager: true
        }
    )
    metaOptions?: MetaOption;
}