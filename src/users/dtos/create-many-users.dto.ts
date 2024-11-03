import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class CreateManyUsersDto {

    @ApiProperty({
        type: "array",
        isArray: true,
        required: true,
        items: {
            type: 'User'
        }
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: CreateUserDto[];
}