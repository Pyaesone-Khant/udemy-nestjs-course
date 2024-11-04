import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokenProvider {

    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    public async generateToken(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accessTokenTTL,
                {
                    email: user.email
                }
            ),
            this.signToken(
                user.id,
                this.jwtConfiguration.refreshTokenTTL
            )
        ])

        return {
            accessToken,
            refreshToken
        }
    }

    public async signToken<T>(
        userId: number,
        expiresIn: number,
        payload?: T
    ) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn,
            }
        )
    }

}
