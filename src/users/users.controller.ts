import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    public findAll() {
        return this.usersService.findAll()
    }

    @Post()
    public create(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.usersService.createUser(createUserDto)
    }
}
