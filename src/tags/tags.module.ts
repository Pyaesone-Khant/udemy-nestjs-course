import { Module } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { TagsController } from './tags.controller';

@Module({
    providers: [TagsService],
    controllers: [TagsController]
})
export class TagsModule { }
