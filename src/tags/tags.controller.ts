import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './provider/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService
    ) { }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    create(
        @Body() createTagDto: CreateTagDto
    ) { 
        return this.tagsService.create(createTagDto)
    }
}
