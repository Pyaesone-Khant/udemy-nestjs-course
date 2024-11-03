import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) { }

    public async findAll(): Promise<Tag[]> {
        let tags = undefined;
        try {
            tags = await this.tagRepository.find();
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return tags;
    }

    public async create(createTagDto: CreateTagDto): Promise<Tag> {
        let tag = undefined;

        try {
            tag = this.tagRepository.create(createTagDto)
            await this.tagRepository.save(tag);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return tag;
    }

    public async findOne(id: number): Promise<Tag> {

        let tag = undefined;

        try {
            tag = this.tagRepository.findOne({
                where: { id }
            });
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        };

        if (!tag) {
            throw new BadRequestException('Tag not found!')
        };

        return tag;
    }

    public async findMultipleTags(ids: number[]): Promise<Tag[]> {

        let tags = undefined;

        try {
            tags = await this.tagRepository.find({
                where: {
                    id: In(ids)
                }
            });
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return tags;
    }

    public async delete(id: number) {

        await this.findOne(id)

        try {
            await this.tagRepository.delete(id);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return {
            success: true,
            message: `Tag with id ${id} deleted successfully`
        }
    }

    public async softDelete(id: number) {

        await this.findOne(id)

        try {
            await this.tagRepository.softDelete(id);
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }

        return {
            success: true,
            message: `Tag with id ${id} soft deleted successfully`
        }
    }

}
