import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';


@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {

    private oAuthClient: OAuth2Client;

    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        private readonly generateTokenProvider: GenerateTokenProvider
    ) { }

    // This method will be called when (the module is initialized || the app start) || It will create a new OAuth2Client instance as soon as (the module is initialized || the app start)
    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientSecret;

        this.oAuthClient = new OAuth2Client(clientId, clientSecret)
    }

    public async authenticate(googleTokenDto: GoogleTokenDto) {
        try {
            // verify the google token sent by the user
            const ticket = await this.oAuthClient.verifyIdToken({
                idToken: googleTokenDto.token,
            });

            const { email, sub: googleId, given_name: firstName, family_name: lastName } = ticket.getPayload();

            // Find a user by googleId
            const user = await this.usersService.findOneByGoogleId(googleId)

            // If the user exist, generate tokens & return them
            if (user) {
                return this.generateTokenProvider.generateToken(user)
            }

            // Create a new user
            const newUser = await this.usersService.createGoogleUser({
                firstName,
                lastName,
                email,
                googleId
            })

            return this.generateTokenProvider.generateToken(newUser);
        } catch (error) {
            throw new UnauthorizedException(error)
        }

    }

}
