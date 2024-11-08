import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './providers/users.service';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';

@Module({
    controllers: [UsersController],
    providers: [UsersService, FindUserByEmailProvider],
    exports: [UsersService],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            }
        ])
    ]
})
export class UsersModule { }
