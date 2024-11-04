import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import jwtConfig from '../config/jwt.config';
import { SignInDto } from '../dtos/signin.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        private readonly hashingProvider: HashingProvider,

        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    public async singIn(signInDto: SignInDto) {
        // find user by email
        // throw an exception if user not found
        let user = await this.usersService.findOneByEmail(signInDto.email);

        // compare password
        let isEqual: boolean = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password)
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not compare password!"
            })
        }

        if (!isEqual) {
            throw new UnauthorizedException("Email or password is wrong!")
        }

        // generate token
        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email
            } as ActiveUserData,
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: this.jwtConfiguration.accessTokenTTL
            }
        )

        // send confirmation
        return {
            accessToken,
        }
    }

}
