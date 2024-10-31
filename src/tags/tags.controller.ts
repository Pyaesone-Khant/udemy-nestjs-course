import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
    constructor(
        private readonly tagsService: TagsService
    ) { }

    @Get()
    public findAll() {
        return this.tagsService.findAll();
    }

    @Get(":id")
    public findOne(@Param("id", ParseIntPipe) id: number) {
        return this.tagsService.findOne(id)
    }

    @Post()
    public create(@Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(createTagDto)
    }

    @Delete(":id")
    public delete(@Param("id", ParseIntPipe) id: number) {
        return this.tagsService.delete(id)
    }

    @Delete(":id/soft-delete")
    public softDelete(@Param("id", ParseIntPipe) id: number) {
        return this.tagsService.softDelete(id)
    }
}

