import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { Post } from './post.entity';
import { CreatePostProvider } from './providers/create-post.provider';

@Injectable()
export class PostsService {

    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly tagsService: TagsService,
        private readonly paginationProvider: PaginationProvider,
        private readonly createPostProvider: CreatePostProvider
    ) { }

    public async findAll(paginationQueryDto: PaginationQueryDto): Promise<Paginated<Post>> {
        let result = undefined;

        try {
            result = await this.paginationProvider.paginateQuery(paginationQueryDto, this.postRepository)
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return result;
    }

    public getPostsByUser(userId: number) {
        const user = this.usersService.findOne(userId);

        return [
            {
                user,
                title: "Post 1",
                content: "This is post 1"
            },
            {
                user,
                title: "Post 2",
                content: "This is post 2"
            }
        ]
    }

    public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
        return await this.createPostProvider.create(createPostDto, user)
    }

    public async update(id: number, patchPostDto: PatchPostDto) {

        let tags = undefined;
        let post = undefined

        try {
            tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        if (!tags || tags?.length !== patchPostDto?.tags?.length) {
            throw new BadRequestException(
                'Invalid Tag!',
                {
                    description: 'One or more tags are invalid!'
                }
            )
        }

        try {
            post = await this.postRepository.findOne({
                where: { id }
            })
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        if (!post) {
            throw new BadRequestException('Post not found!')
        }

        post.title = patchPostDto.title ?? post.title;
        post.content = patchPostDto.content ?? post.content;
        post.status = patchPostDto.status ?? post.status;
        post.postType = patchPostDto.postType ?? post.postType;
        post.slug = patchPostDto.slug ?? post.slug;
        post.publishOn = patchPostDto.publishOn ?? post.publishOn;
        post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;

        // Update the tags
        post.tags = tags;

        try {
            await this.postRepository.save(post);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return post
    }

    public async findOne(id: number) {
        let post = undefined;

        try {
            post = await this.postRepository.findOne({
                where: { id }
            })
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        if (!post) {
            throw new BadRequestException('Post not found!')
        }

        return post;
    }

    public async delete(id: number) {
        await this.findOne(id);

        await this.postRepository.delete(id);

        return {
            success: true,
            message: `Post with ID ${id} has been deleted!`
        }
    }
}
