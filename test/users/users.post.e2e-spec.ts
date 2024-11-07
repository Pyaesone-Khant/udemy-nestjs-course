import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { completUser, missingEmail, missingFirstName, missingPassword } from './users.post.e2e-spec.sample-data';

// [Users] assigning as UserController
describe('[Users] @Post Endpoints', () => {
    let app: INestApplication;
    let config: ConfigService;
    let httpServer: App;

    beforeEach(async () => {
        app = await bootstrapNestApplication();
        config = app.get<ConfigService>(ConfigService);
        httpServer = app.getHttpServer();
    });

    afterEach(async () => {
        await dropDatabase(config);
        await app.close();
    })

    it('/users - Endpoint is public', async () => {
        return request(httpServer)
            .post('/users')
            .send({})
            .expect(400)
    })

    it("/users - firstName is mandatory", async () => {
        return request(httpServer)
            .post('/users')
            .send(missingFirstName)
            .expect(400)
    });

    it("/users - email is mandatory", async () => {
        return request(httpServer)
            .post('/users')
            .send(missingEmail)
            .expect(400)
    });

    it("/users - password is mandatory", async () => {
        return request(httpServer)
            .post('/users')
            .send(missingPassword)
            .expect(400)
    });

    it("/users - Valid Request successfully creates user", async () => {
        return request(httpServer)
            .post('/users')
            .send(completUser)
            .expect(201)
            .then(({ body }) => {
                expect(body).toBeDefined();
                expect(body.data).toBeDefined();
                expect(body.data.firstName).toBe(completUser.firstName);
                expect(body.data.lastName).toBe(completUser.lastName);
                expect(body.data.email).toBe(completUser.email);
            })
    });

    it("/users - password is not returned in response", async () => {
        return request(httpServer)
            .post('/users')
            .send(completUser)
            .expect(201)
            .then(({ body }) => {
                expect(body).toBeDefined();
                expect(body.data).toBeDefined();
                expect(body.data.password).toBeUndefined()
            })
    });

    it("/users - googleId is not returned in response", async () => {
        return request(httpServer)
            .post('/users')
            .send(completUser)
            .expect(201)
            .then(({ body }) => {
                expect(body).toBeDefined();
                expect(body.data).toBeDefined();
                expect(body.data.googleId).toBeUndefined()
            })
    });
});
