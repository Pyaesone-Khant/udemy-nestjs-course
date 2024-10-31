import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {

    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly tagsService: TagsService
    ) { }

    public findAll() {
        return this.postRepository.find();
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

    public async create(createPostDto: CreatePostDto) {
        let author = await this.usersService.findOne(createPostDto.authorId);

        let tags = await this.tagsService.findMultipleTags(createPostDto.tags)

        let post = this.postRepository.create({ ...createPostDto, author, tags });

        return await this.postRepository.save(post)
    }

    public async update(id: number, patchPostDto: PatchPostDto) {
        let tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
        let post = await this.postRepository.findOne({
            where: { id }
        })

        if (!post) {
            return {
                success: false,
                message: `Post with ID ${id} not found!`
            }
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

        return await this.postRepository.save(post);
    }

    public async delete(id: number) {
        await this.postRepository.delete(id);
        return {
            success: true,
            message: `Post with ID ${id} has been deleted!`
        }
    }
}
