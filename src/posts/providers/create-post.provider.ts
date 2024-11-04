import { BadRequestException, ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { FindPostBySlugProvider } from './find-post-by-slug.provider';

@Injectable()
export class CreatePostProvider {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly usersService: UsersService,

        private readonly tagsService: TagsService,

        private readonly findPostBySlugProvider: FindPostBySlugProvider,
    ) { }

    public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
        let post = undefined;
        let author = undefined;
        let tags = undefined;
        let postBySlug = undefined;

        try {
            author = await this.usersService.findOne(user.sub);
            tags = await this.tagsService.findMultipleTags(createPostDto.tags)
        } catch (error) {
            throw new ConflictException(error);
        }

        if (!author) {
            throw new BadRequestException('Author not found!')
        }

        if (tags?.length !== createPostDto?.tags?.length) {
            throw new BadRequestException('Invalid tags found!')
        }

        try {
            postBySlug = await this.findPostBySlugProvider.findPostBySlug(createPostDto.slug);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        if (postBySlug) {
            throw new ConflictException(`Post with slug ${createPostDto.slug} already exists!`)
        }

        try {
            post = this.postRepository.create({ ...createPostDto, author, tags });
            await this.postRepository.save(post)
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return post;
    }

}
