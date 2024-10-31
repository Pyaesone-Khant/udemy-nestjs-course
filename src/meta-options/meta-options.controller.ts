import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostMetaOptionDto } from './dtos/create-post-meta-option.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
    constructor(
        private readonly metaOptionsService: MetaOptionsService
    ) { }

    @Get()
    public findAll() {
        return this.metaOptionsService.findAll()
    }

    @Post()
    public create(@Body() createPostMetaOptionDto: CreatePostMetaOptionDto) {
        return this.metaOptionsService.createMetaOption(createPostMetaOptionDto)
    }

}
