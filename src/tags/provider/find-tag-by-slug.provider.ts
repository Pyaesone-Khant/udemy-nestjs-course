import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from '../tag.schema';

@Injectable()
export class FindTagBySlugProvider {

    constructor(
        @InjectModel(Tag.name)
        private readonly tagModel: Model<Tag>
    ) { }

    public async findBySlug(slug: string): Promise<Tag> {
        let tag: Tag | undefined;

        try {
            tag = await this.tagModel.findOne({ slug }).exec();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return tag;
    }

}
