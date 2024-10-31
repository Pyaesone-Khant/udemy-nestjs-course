import { IsJSON, IsNotEmpty } from "class-validator"

export class CreatePostMetaOptionDto {
    @IsJSON()
    @IsNotEmpty()
    metaValue: string
}