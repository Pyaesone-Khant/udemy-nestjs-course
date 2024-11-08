import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.schema';
import { FindTagBySlugProvider } from './find-tag-by-slug.provider';

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tag.name)
        private readonly tagModel: Model<Tag>,

        private readonly findTagBySlugProvider: FindTagBySlugProvider
    ) { }

    public async findAll(): Promise<Tag[]> {

        let tags: Tag[];

        try {
            tags = await this.tagModel.find().exec();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return tags;
    }

    public async create(createTagDto: CreateTagDto): Promise<Tag> {
        let newTag: Tag | undefined;

        const tag = await this.findTagBySlugProvider.findBySlug(createTagDto.slug);

        if (tag) {
            throw new BadRequestException('Tag already exists.');
        }

        try {
            newTag = new this.tagModel(createTagDto);
            await newTag.save();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return newTag;
    }
}
