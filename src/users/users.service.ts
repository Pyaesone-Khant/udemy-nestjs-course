import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
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
        private readonly dataSource: DataSource

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
        throw new HttpException(
            {
                status: HttpStatus.MOVED_PERMANENTLY,
                error: 'The API endpoint does not exist',
            },
            HttpStatus.MOVED_PERMANENTLY,
            {
                description: 'The API endpoint does not exist'
            }
        )

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
     * The method to create multiple users.
     * Used transaction => if success then commit/finish operation, if not success then rollback the whole operation
     */
    public async createMany(createUsersData: CreateUserDto[]) {

        let newUsers: User[] = [];

        // create Query Runner Instance => to create transaction
        const queryRunner = this.dataSource.createQueryRunner();

        // connect Query Runner to dataSource
        await queryRunner.connect();

        // start transaction
        await queryRunner.startTransaction();

        try {
            for (let user of createUsersData) {
                let newUser = queryRunner.manager.create(User, user)
                newUser = await queryRunner.manager.save(newUser);
                newUsers.push(newUser);
            }

            // if success, commit 
            await queryRunner.commitTransaction();
        } catch (error) {
            // if not success, rollback
            await queryRunner.rollbackTransaction();
        } finally {
            // release connection
            await queryRunner.release()
        }

        return newUsers;
    }
}
