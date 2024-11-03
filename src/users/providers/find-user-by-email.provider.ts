import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async findOneByEmail(email: string) {
        let user: User | undefined = undefined;

        try {
            user = await this.userRepository.findOne({
                where: { email }
            })
        } catch (error) {
            throw new RequestTimeoutException(
                "Request Timeout! Unable to connect to database!"
            )
        }

        if (!user) {
            throw new BadRequestException("User not found!")
        }

        return user;
    }
}
