import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { CreateGoogleUserProvider } from "./providers/create-google-user.provider";
import { CreateUserProvider } from "./providers/create-user.provider";
import { FindOneByGoogleIdProvider } from "./providers/find-one-by-google-id.provider";
import { FindUserByEmailProvider } from "./providers/find-user-by-email.provider";
import { UsersCreateManyProvider } from "./providers/users-create-many.provider";
import { UsersService } from "./providers/users.service";
import { User } from "./user.entity";

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const mockCreateUserProvider: Partial<CreateUserProvider> = {
            create: (createUserDto: CreateUserDto) => Promise.resolve({
                id: 1,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                email: createUserDto.email,
                password: createUserDto.password
            })
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: CreateUserProvider, useValue: mockCreateUserProvider },
                { provide: CreateGoogleUserProvider, useValue: {} },
                { provide: FindOneByGoogleIdProvider, useValue: {} },
                { provide: FindUserByEmailProvider, useValue: {} },
                { provide: UsersCreateManyProvider, useValue: {} },
                { provide: getRepositoryToken(User), useValue: {} },
                { provide: DataSource, useValue: {} },
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(service.create).toBeDefined();
        });

        it('should create a user', async () => {
            const user = await service.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'example@gmail.com',
                password: 'Asdfghjkl!1'
            });

            expect(user.firstName).toEqual('John');
        });
    });
});
