import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionDto } from '../dtos/create-post-meta-option.dto';
import { MetaOption } from '../meta-option.entity';

@Injectable()
export class MetaOptionsService {
    constructor(
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>
    ) { }

    public async findAll(): Promise<MetaOption[]> {
        return await this.metaOptionRepository.find();
    }

    public async createMetaOption(createPostMetaOption: CreatePostMetaOptionDto): Promise<MetaOption> {
        let metaOption = this.metaOptionRepository.create(createPostMetaOption);

        return await this.metaOptionRepository.save(metaOption);
    }
}
