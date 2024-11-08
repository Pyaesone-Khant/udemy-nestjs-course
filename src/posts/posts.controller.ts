import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Post()
    create(
        @Body() createPostDto: CreatePostDto
    ) {
        return this.postsService.createPost(createPostDto);
    }
}
