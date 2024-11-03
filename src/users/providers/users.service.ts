import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { UsersCreateManyProvider } from './users-create-many.provider';

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

        /**
         * Inject usersCreateManyProvider
         */
        private readonly usersCreateManyProvider: UsersCreateManyProvider,

        /**
         * specific custom config file for user service
         */
        // @Inject(profileConfig.KEY)
        // private readonly profileConfiguration: ConfigType<typeof profileConfig>
    ) { }

    /**
     * The method to get all Users.
     */
    public async findAll(limit: number, page: number) {

        // custom exception using HttpException
        // throw new HttpException(
        //     {
        //         status: HttpStatus.MOVED_PERMANENTLY,
        //         error: 'The API endpoint does not exist',
        //     },
        //     HttpStatus.MOVED_PERMANENTLY,
        //     {
        //         description: 'The API endpoint does not exist'
        //     }
        // )

        let users = await this.userRepository.find();
        return users;
    }

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
        let newUser = this.userRepository.create(createUserDto)
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

    /**
     * The method to get One User.
     */
    public async findOne(id: number) {

        let user = undefined;

        try {
            user = await this.userRepository.findOne({
                where: { id }
            });
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment, please try again later!',
                {
                    description: 'Error connecting to database!'
                }
            )
        }

        if (!user) {
            throw new BadRequestException(
                'User not found!',
            )
        }

        return user;
    }

    /**
     * Ths method to create multiple users.
     */
    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        let newUsers = await this.usersCreateManyProvider.createMany(createManyUsersDto)
        return newUsers;
    }
}