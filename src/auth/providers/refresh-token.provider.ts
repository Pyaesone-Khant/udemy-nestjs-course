import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import jwtConfig from '../config/jwt.config';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class RefreshTokenProvider {

    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        private readonly generateTokenProvider: GenerateTokenProvider,

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }

    public async refreshToken(refreshTokenDto: RefreshTokenDto) {
        try {
            // verify incoming refresh token using jwtService
            const { sub } = await this.jwtService.verifyAsync<Partial<ActiveUserData>>(
                refreshTokenDto.refreshToken,
                {
                    secret: this.jwtConfiguration.secret,
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer,
                }
            )

            // fetch user from database
            const user = await this.usersService.findOne(sub)

            // generate new access token and refresh token
            return await this.generateTokenProvider.generateToken(user)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }

}
