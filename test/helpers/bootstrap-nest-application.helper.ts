import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "aws-sdk";
import { appCreate } from "src/app.create";
import { AppModule } from "src/app.module";

export async function bootstrapNestApplication(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            AppModule,
            ConfigModule
        ],
        providers: [
            ConfigService
        ]
    }).compile();

    const app = moduleFixture.createNestApplication();
    appCreate(app);
    await app.init();

    return app;
}