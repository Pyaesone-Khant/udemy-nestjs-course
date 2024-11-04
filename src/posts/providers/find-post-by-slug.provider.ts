import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class FindPostBySlugProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    public async findPostBySlug(slug: string): Promise<Post> {
        let post: Post | undefined = undefined;

        try {
            post = await this.postRepository.findOne({
                where: { slug }
            })
        } catch (error) {
            throw new RequestTimeoutException(
                "Request Timeout! Unable to connect to database!"
            )
        }

        return post;
    }

}
