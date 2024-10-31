import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './providers/tags.service';
import { Tag } from './tag.entity';
import { TagsController } from './tags.controller';

@Module({
    providers: [TagsService],
    controllers: [TagsController],
    imports: [
        TypeOrmModule.forFeature([Tag])
    ]
})
export class TagsModule { }
