import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsDate, IsEnum, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, ValidateNested } from "class-validator"
import { MetaOption } from "src/meta-options/meta-option.entity"
import { CreatePostMetaOptionDto } from "../../meta-options/dtos/create-post-meta-option.dto"
import { PostStatus } from "../enums/postStatus.enum"
import { PostType } from "../enums/postType.enum"

export class CreatePostDto {

    @ApiProperty({
        description: "The title of the post",
        example: "My first post"
    })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsNotEmpty()
    title: string

    @ApiProperty({
        description: "Types: 'post' | 'page' | 'story' | 'series'",
        enum: PostType
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType

    @ApiProperty({
        description: "A slug is a URL-friendly version of the post title. It is usually all lowercase and contains only letters, numbers, and hyphens.",
        example: "my-first-post"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "A slug should be all lowercase, and words should be separated by hyphens(-)."
    })
    slug: string

    @ApiProperty({
        enum: PostStatus
    })
    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus

    @ApiPropertyOptional({
        description: "The content of the post",
        example: "This is my first post. Welcome to my blog!"
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    content?: string

    @ApiPropertyOptional({
        description: "The schema of the post content",
        example: "{ \"type\": \"object\", \"properties\": { \"title\": { \"type\": \"string\" } } }"
    })
    @IsOptional()
    @IsJSON()
    schema?: string

    @ApiPropertyOptional({
        description: "The URL of the featured image of the post",
        example: "https://example.com/image.jpg"
    })
    @IsOptional()
    @MaxLength(1024)
    @IsUrl()
    featuredImageUrl?: string

    @ApiPropertyOptional({
        description: "The date when the post should be published",
        example: "2024-03-16T07:46:32+0000"
    })
    @IsOptional()
    @IsDate()
    publishOn?: Date

    @ApiPropertyOptional({
        description: "The tag IDs of the post",
        example: [1, 2]
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tags?: number[]

    @ApiPropertyOptional({
        description: "The meta options of the post",
        required: false,
        type: MetaOption,
        items: {
            type: "object",
            properties: {
                metaValue: {
                    type: 'json',
                    example: '{"sidebarEnabled": true}'
                },
            }
        },
    })
    @IsOptional()
    // validate nested objects
    @ValidateNested({ each: true })
    @Type(() => CreatePostMetaOptionDto)
    metaOptions: CreatePostMetaOptionDto | null;

    @ApiProperty({
        type: "integer",
        required: true,
        example: 1
    })
    @IsInt()
    @IsNotEmpty()
    authorId: number
}