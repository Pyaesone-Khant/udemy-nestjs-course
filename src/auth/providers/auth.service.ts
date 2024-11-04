import { Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SignInDto } from '../dtos/signin.dto';
import { RefreshTokenProvider } from './refresh-token.provider';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly signInProvider: SignInProvider,

        private readonly refreshTokenProvider: RefreshTokenProvider
    ) { }

    public async signIn(signInDto: SignInDto) {
        return await this.signInProvider.singIn(signInDto)
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto) {
        return await this.refreshTokenProvider.refreshToken(refreshTokenDto)
    }
}
