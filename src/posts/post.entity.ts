import { MetaOption } from "src/meta-options/meta-option.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    tags?: string[];

    // OneToOne relation with MetaOption (Uni-directional)
    @OneToOne(() => MetaOption, {
        cascade: true
    })
    @JoinColumn()
    metaOptions?: MetaOption;
}