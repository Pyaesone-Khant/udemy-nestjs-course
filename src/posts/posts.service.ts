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

    public updatePost(request: PatchPostDto) {
        return request;
    }

    public async delete(id: number) {
        await this.postRepository.delete(id);
        return {
            success: true,
            message: `Post with ID ${id} has been deleted!`
        }
    }
}
