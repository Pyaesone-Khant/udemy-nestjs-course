import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/user.schema";
import { PostStatus } from "./enums/post-status.enum";
import { PostType } from "./enums/post-type.enum";

@Schema()
export class Post extends Document {

    @Prop({
        type: String,
        isRequired: true
    })
    title: string;

    @Prop({
        type: String,
        isRequired: true,
        enum: PostType,
        default: PostType.POST
    })
    postType: PostType;

    @Prop({
        type: String,
        isRequired: true
    })
    slug: string;

    @Prop({
        type: String,
        isRequired: true,
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @Prop({
        type: String,
        isRequired: false
    })
    content?: string;

    @Prop({
        type: String,
        isRequired: false
    })
    featuredImageUrl?: string;

    @Prop({
        type: Date,
        isRequired: false
    })
    publishOn?: Date

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name
    })
    author: User
}

export const PostSchema = SchemaFactory.createForClass(Post);