import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';

@Injectable()
export class FindUserByEmailProvider {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    async findUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email });
    }

}
