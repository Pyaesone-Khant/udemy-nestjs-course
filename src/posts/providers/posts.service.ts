import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.schema';

@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>,

        private readonly usersService: UsersService,
    ) { }

    public async findAll(): Promise<Post[]> {
        let posts: Post[] | undefined = undefined;

        try {
            posts = await this.postModel.find().exec();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return posts;
    }

    public async createPost(createPostDto: CreatePostDto) {

        let post: Post | undefined;

        try {
            post = new this.postModel(createPostDto);
            await post.save();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return post;
    }

}
