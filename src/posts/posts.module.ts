import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    imports: [
        MongooseModule.forFeature([
            {
                name: Post.name,
                schema: PostSchema
            }
        ])
    ]
})
export class PostsModule { }
