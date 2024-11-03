import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { User } from '../user.entity';

@Injectable()
export class UsersCreateManyProvider {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    /**
     * The method to create multiple users.
     * Used transaction => if success then commit/finish operation, if not success then rollback the whole operation
     */
    public async createMany(createManyUsersDto: CreateManyUsersDto) {

        let newUsers: User[] = [];

        // create Query Runner Instance => to create transaction
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            // connect Query Runner to dataSource
            await queryRunner.connect();
            // start transaction
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout! Unable to connect to database!')
        }


        try {
            for (let user of createManyUsersDto.users) {
                let newUser = queryRunner.manager.create(User, user)
                newUser = await queryRunner.manager.save(newUser);
                newUsers.push(newUser);
            }

            // if success, commit 
            await queryRunner.commitTransaction();
        } catch (error) {
            // if not success, rollback
            await queryRunner.rollbackTransaction();
            throw new ConflictException(
                'Unable to complete the transaction!',
                {
                    description: String(error)
                }
            )
        } finally {
            try {
                // release connection
                await queryRunner.release()
            } catch (error) {
                throw new RequestTimeoutException(
                    'Request Timeout! Unable to release connection!',
                    {
                        description: String(error)
                    }
                )
            }
        }

        return newUsers;
    }
}
