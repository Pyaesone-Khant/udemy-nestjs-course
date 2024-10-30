import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

/**
 * Class to connect to the database and perform CRUD operations on the users table.
 */
@Injectable()
export class UsersService {

    /**
     * Constructor to inject the services.
     */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    /**
     * The method to create a new User.
     */
    public async create(createUserDto: CreateUserDto) {
        // check if user exists or not
        const existingUser = this.userRepository.findOne({
            where: {
                email: createUserDto.email
            }
        })

        // if user exists, throw error (Handle exception)
        if (existingUser) {

        }

        // create user
        let newUser = this.userRepository.create(createUserDto)
        newUser = await this.userRepository.save(newUser)
        return newUser
    }

    /**
     * The method to get One User.
     */
    public findOne(id: number) {
        return {
            id,
            name: 'John Doe',
            email: 'johndoe@gmail.com'
        }
    }
}
