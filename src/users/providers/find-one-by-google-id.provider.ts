import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneByGoogleIdProvider {
    constructor(
        // Inject the User repository
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async findOneByGoogleId(googleId: string): Promise<User | undefined> {
        // Find a user by googleId
        return await this.userRepository.findOne({
            where: { googleId }
        });
    }
}
