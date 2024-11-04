import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    public findAll(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.postsService.findAll(paginationQueryDto);
    }

    @Get(":userId")
    getPosts(
        @Param("userId") userId: number,
        @Query() postQuery: GetPostsDto
    ) {
        return this.postsService.getPostsByUser(userId);
    }

    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @Post()
    create(
        @Body() createPostDto: CreatePostDto,
        @ActiveUser() userData: ActiveUserData
    ) {

        return userData

        // return this.postsService.create(createPostDto);
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
