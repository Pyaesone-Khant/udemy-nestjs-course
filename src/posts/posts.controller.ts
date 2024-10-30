import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get(":userId")
    getPosts(@Param("userId", ParseIntPipe) userId: number) {
        return this.postsService.getPostsByUser(userId);
    }


    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @Post()
    create(@Body() request: CreatePostDto) {
        return this.postsService.createPost(request);
    }

    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @Patch()
    update(@Body() request: PatchPostDto) {
        return this.postsService.updatePost(request);
    }
}
