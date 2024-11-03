import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {

    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ) { }

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>
    ): Promise<Paginated<T>> {
        const { page, limit } = paginationQuery;
        let data = await repository.find({
            skip: (page - 1) * limit,
            take: limit
        })

        /**
         * creating urls
         */
        const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';

        const newURL = new URL(this.request.url, baseURL);

        /**
         * calculating page number
         */
        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / limit);
        const nextPage = page === totalPages ? page : page + 1;
        const prevPage = page === 1 ? page : page - 1;

        const response: Paginated<T> = {
            data,
            meta: {
                itemsPerPage: limit,
                totalItems,
                totalPages,
                currentPage: page
            },
            links: {
                first: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=1`,
                last: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${totalPages}`,
                current: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${page}`,
                next: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${nextPage}`,
                previous: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${prevPage}`,
            }
        }

        return response;
    }
}
