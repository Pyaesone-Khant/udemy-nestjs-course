import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,

        private readonly signInProvider: SignInProvider
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.singIn(signInDto)
    }

    public isAuthenticated() {
        return true;
    }
}
