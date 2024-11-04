import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostProvider } from './providers/create-post.provider';
import { FindPostBySlugProvider } from './providers/find-post-by-slug.provider';

@Module({
    controllers: [PostsController],
    providers: [PostsService, CreatePostProvider, FindPostBySlugProvider],
    imports: [
        UsersModule,
        TagsModule,
        TypeOrmModule.forFeature([Post]),
        PaginationModule
    ]
})
export class PostsModule { }
