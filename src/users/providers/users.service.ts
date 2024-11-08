import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.schema';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly findUserByEmailProvider: FindUserByEmailProvider
    ) { }

    public async findAll(): Promise<User[]> {
        let users: User[] | undefined = undefined;

        try {
            users = await this.userModel.find().exec();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return users;
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        let newUser: User | undefined = undefined;

        const user = await this.findUserByEmailProvider.findUserByEmail(createUserDto.email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        try {
            newUser = new this.userModel(createUserDto);
            await newUser.save();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return newUser;
    }

    public async findOne(userId: string) {
        let user: User | undefined;

        try {
            user = await this.userModel.findById(userId).exec();
        } catch (error) {
            throw new RequestTimeoutException(error)
        }

        return user;
    }
}
