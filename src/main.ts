import { NestFactory } from '@nestjs/core';
import { appCreate } from './app.create';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // add middlewares
    appCreate(app);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
