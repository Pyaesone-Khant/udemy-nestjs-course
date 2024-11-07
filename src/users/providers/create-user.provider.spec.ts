import { BadRequestException } from "@nestjs/common";
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

    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'Asdfghjkl!1',
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserProvider,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(User), useValue: createMockRepository() },
                {
                    provide: HashingProvider,
                    useValue: {
                        hashPassword: jest.fn(() => user.password)
                    }
                },
                {
                    provide: MailService,
                    useValue: {
                        sendWelcomeMail: jest.fn(() => Promise.resolve())
                    }
                },
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

        describe('when user does not exist in database', () => {
            it('should create a user', async () => {
                userRepository.findOne.mockReturnValue(null);
                userRepository.create.mockReturnValue(user);
                userRepository.save.mockReturnValue(user);
                const newUser = await provider.create(user);
                expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
                expect(userRepository.create).toHaveBeenCalledWith(user);
                expect(userRepository.save).toHaveBeenCalledWith(user);
            })
        })

        describe('when user exists in database', () => {
            it('should throw an error', async () => {
                userRepository.findOne.mockReturnValue(user.email);
                userRepository.create.mockReturnValue(user);
                userRepository.save.mockReturnValue(user);
                try {
                    const newUser = await provider.create(user);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                }
            })
        })
    })

})