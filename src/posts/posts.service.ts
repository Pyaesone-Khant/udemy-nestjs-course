import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {

    constructor(
        private readonly userService: UsersService,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>
    ) { }

    public findAll() {
        return this.postRepository.find();
    }

    public getPostsByUser(userId: number) {
        const user = this.userService.findOne(userId);

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
        let post = this.postRepository.create(createPostDto);

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
