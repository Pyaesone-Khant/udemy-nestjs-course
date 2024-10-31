import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength } from "class-validator";

export class CreateTagDto {

    @ApiProperty({
        description: "The name of the tag",
        example: "JavaScript"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: "A slug is a URL-friendly version of the tag name. It is usually all lowercase and contains only letters, numbers, and hyphens.",
        example: "javascript"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "A slug should be all lowercase, and words should be separated by hyphens(-)."
    })
    slug: string;

    @ApiPropertyOptional({
        description: "A brief description of the tag",
        example: "JavaScript is a programming language that conforms to the ECMAScript specification."
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: "The schema of the tag content",
        example: "{ \"type\": \"object\", \"properties\": { \"title\": { \"type\": \"string\" } } }"
    })
    @IsString()
    @IsOptional()
    schema?: string

    @ApiPropertyOptional({
        description: "The URL of the featured image of the tag",
        example: "https://example.com/images/javascript.jpg"
    })
    @IsUrl()
    @IsOptional()
    @MaxLength(1024)
    featuredImageUrl?: string
}