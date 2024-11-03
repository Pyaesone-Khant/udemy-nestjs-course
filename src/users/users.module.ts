import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import profileConfig from './config/profile.config';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersCreateManyProvider,
        CreateUserProvider,
        FindUserByEmailProvider
    ],
    exports: [UsersService],
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            User
        ]),
        ConfigModule.forFeature(profileConfig)
    ]
})
export class UsersModule { }
