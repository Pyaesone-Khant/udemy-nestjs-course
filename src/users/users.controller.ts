import { Body, Controller, DefaultValuePipe, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1
    })
    findAll(
        @Query('limit', new DefaultValuePipe(10)) limit: number,
        @Query('page', new DefaultValuePipe(1)) page: number
    ) {
        return this.usersService.findAll(limit, page)
    }

    @Get(":id?")
    findOne(@Param() getUsersParam: GetUsersParamDto) {
        return this.usersService.findOne(getUsersParam.id);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
