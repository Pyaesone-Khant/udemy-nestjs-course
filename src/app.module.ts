import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

const ENV = process.env.NODE_ENV;

@Module({
    imports: [
        PostsModule,
        UsersModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: !ENV ? '.env' : `.env.${ENV}`,
            load: [
                appConfig,
                databaseConfig
            ]
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                uri: config.get('database.mongoUri'),
                dbName: config.get('database.mongoDBName'),
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // applying data response interceptor to the whole application
        {
            provide: APP_INTERCEPTOR,
            useClass: DataResponseInterceptor
        }
    ],
})
export class AppModule { }
