import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    public findAll() {
        return this.postsService.findAll();
    }

    @Get(":userId")
    getPosts(@Param("userId", ParseIntPipe) userId: number) {
        return this.postsService.getPostsByUser(userId);
    }

    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @Patch(":id")
    update(@Param('id', ParseIntPipe) id: number, @Body() patchPostDto: PatchPostDto) {
        return this.postsService.update(id, patchPostDto);
    }

    @Delete(':id')
    public delete(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.delete(id);
    }
}
