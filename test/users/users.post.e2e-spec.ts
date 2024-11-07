import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import { dropDatabase } from 'test/helpers/drop-database.helper';

// [Users] assigning as UserController
describe('[Users] @Post Endpoints', () => {
    let app: INestApplication;
    let config: ConfigService;

    beforeEach(async () => {
        app = await bootstrapNestApplication();
        config = app.get<ConfigService>(ConfigService);
    });

    afterEach(async () => {
        await dropDatabase(config);
        await app.close();
    })

    it.todo("/users - Endpoint in public");
    it.todo("/users - firstName is mandatory");
    it.todo("/users - email is mandatory");
    it.todo("/users - password is mandatory");
    it.todo("/users - Valid Request successfully creates user");
    it.todo("/users - password is not returned in response");
    it.todo("/users - googleId is not returned in response");
});
