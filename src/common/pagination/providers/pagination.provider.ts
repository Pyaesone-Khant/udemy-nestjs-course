import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

@Injectable()
export class PaginationProvider {
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>
    ) {
        const { page, limit } = paginationQuery;
        let data = await repository.find({
            skip: (page - 1) * limit,
            take: limit
        })
        return data;
    }
}
