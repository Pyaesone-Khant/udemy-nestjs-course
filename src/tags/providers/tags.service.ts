import { Injectable } from '@nestjs/common';
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
        return this.tagRepository.find();
    }

    public async create(createTagDto: CreateTagDto): Promise<Tag> {
        let tag = this.tagRepository.create(createTagDto)

        return this.tagRepository.save(tag);
    }

    public async findOne(id: number): Promise<Tag> {
        return this.tagRepository.findOne({
            where: { id }
        });
    }

    public async findMultipleTags(ids: number[]): Promise<Tag[]> {
        return await this.tagRepository.find({
            where: {
                id: In(ids)
            }
        });
    }

    public async delete(id: number) {
        await this.tagRepository.delete(id);

        return {
            success: true,
            message: `Tag with id ${id} deleted successfully`
        }
    }

    public async softDelete(id: number) {
        await this.tagRepository.softDelete(id);

        return {
            success: true,
            message: `Tag with id ${id} soft deleted successfully`
        }
    }

}
