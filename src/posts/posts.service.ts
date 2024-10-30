import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Injectable()
export class PostsService {

    constructor(
        private readonly userService: UsersService
    ) { }

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

    public createPost(request: CreatePostDto) {
        return request;
    }

    public updatePost(request: PatchPostDto) {
        return request;
    }
}
