import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

const ENV = process.env.NODE_ENV

@Module({
    imports: [
        UsersModule,
        PostsModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: !ENV ? '.env' : `.env.${ENV}`,
            load: [
                appConfig,
                databaseConfig
            ],
            validationSchema: environmentValidation
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                synchronize: configService.get('database.synchronize'),
                // entities: [
                //     User
                // ],
                autoLoadEntities: configService.get('database.autoLoadEntities')
            })
        }),
        TagsModule,
        MetaOptionsModule,
        PaginationModule,
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider())
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            // applying authenticaiton guard to the whole application
            provide: APP_GUARD,
            useClass: AuthenticationGuard
        },
        // must be provided in the module where it is used to work 'AuthenticationGuard'
        AccessTokenGuard,
    ],
})
export class AppModule { }
