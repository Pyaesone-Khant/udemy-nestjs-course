import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    /**
     * swagger configuration
     */

    const config = new DocumentBuilder()
        .setVersion("1.0")
        .setTitle("NestJS Masterclass - Blog App API")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document)

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
