import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './provider/tags.service';
import { Tag, TagSchema } from './tag.schema';
import { TagsController } from './tags.controller';
import { FindTagBySlugProvider } from './provider/find-tag-by-slug.provider';

@Module({
    controllers: [TagsController],
    providers: [TagsService, FindTagBySlugProvider],
    exports: [TagsService],
    imports: [
        MongooseModule.forFeature([
            {
                name: Tag.name,
                schema: TagSchema
            }
        ])
    ]
})
export class TagsModule { }
