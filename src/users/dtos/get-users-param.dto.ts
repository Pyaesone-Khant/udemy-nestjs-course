import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetUsersParamDto {
    @ApiPropertyOptional({
        example: 1,
        required: false
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number
}