import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class CreateUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) { }

    /**
    * The method to create a new User.
    */
    public async create(createUserDto: CreateUserDto) {

        let existingUser = undefined;

        try {
            // check if user exists or not
            existingUser = await this.userRepository.findOne({
                where: {
                    email: createUserDto.email
                }
            })
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment, please try again later!',
                {
                    description: 'Error connecting to database!'
                }
            )
        }

        // if user exists, throw error (Handle exception)
        if (existingUser) {
            throw new BadRequestException(
                'User with this email already exists!',
            )
        }

        // create user
        let newUser = this.userRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password)
        })
        try {
            newUser = await this.userRepository.save(newUser)
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment, please try again later!',
                {
                    description: 'Error connecting to database!'
                }
            )
        }

        return newUser;
    }

}
