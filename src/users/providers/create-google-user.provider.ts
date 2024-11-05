import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';
import { User } from '../user.entity';

@Injectable()
export class CreateGoogleUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    public async createGoogleUser(googleUser: GoogleUser) {
        let user = undefined;
        try {
            user = this.userRepository.create(googleUser);
            return await this.userRepository.save(user)
        } catch (error) {
            throw new ConflictException(
                error,
                {
                    description: "Could not create user!",
                }
            )
        }

    }

}
