import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { MailService } from "src/mail/providers/mail.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { CreateUserProvider } from "./create-user.provider";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
})


describe('CreateUserProvider', () => {
    let provider: CreateUserProvider;
    let userRepository: MockRepository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserProvider,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(User), useValue: createMockRepository() },
                { provide: HashingProvider, useValue: {} },
                { provide: MailService, useValue: {} },
            ]
        }).compile();

        provider = module.get<CreateUserProvider>(CreateUserProvider);

        userRepository = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(provider.create).toBeDefined();
        });
    })
})