import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';

export function appCreate(app: INestApplication) {
    const appConfigService = app.get(ConfigService)
    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true //implicitly converting types
        }
    }));
    app.enableCors(); //enable cors for all routes

    /**
     * swagger configuration
     */
    const swaggerConfig = new DocumentBuilder()
        .setVersion("1.0")
        .setTitle("NestJS Masterclass - Blog App API")
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document)

    /**
     * setup aws sdk
     */
    const awsConfig = {
        credentials: {
            accessKeyId: appConfigService.get('appConfig.awsAccessKeyId'),
            secretAccessKey: appConfigService.get('appConfig.awsSecretAccessKey')
        },
        region: appConfigService.get('appConfig.awsRegion'),
    }
    config.update(awsConfig)
}