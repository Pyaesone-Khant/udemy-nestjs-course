import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator"
import { PostStatus } from "../enums/post-status.enum"
import { PostType } from "../enums/post-type.enum"

export class CreatePostDto {

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsNotEmpty()
    title: string

    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "A slug should be all lowercase, and words should be separated by hyphens(-)."
    })
    slug: string

    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus

    @IsOptional()
    @IsString()
    @MinLength(10)
    content?: string

    @IsOptional()
    @MaxLength(1024)
    @IsUrl()
    featuredImageUrl?: string

    @IsOptional()
    @IsDate()
    publishOn?: Date

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[]
}