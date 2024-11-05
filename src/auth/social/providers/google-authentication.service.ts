import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';


@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {

    private oAuthClient: OAuth2Client;

    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    // This method will be called when (the module is initialized || the app start) || It will create a new OAuth2Client instance as soon as (the module is initialized || the app start)
    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientSecret;

        this.oAuthClient = new OAuth2Client(clientId, clientSecret)
    }

}
