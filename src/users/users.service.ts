import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import profileConfig from './config/profile.config';
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
        private readonly userRepository: Repository<User>,
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration: ConfigType<typeof profileConfig>
    ) { }

    /**
     * The method to get all Users.
     */
    public async findAll() {

        return this.profileConfiguration;

        let users = await this.userRepository.find();
        return users;
    }

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
    public async findOne(id: number) {

        let user = await this.userRepository.findOne({
            where: { id }
        });

        return user;
    }
}
