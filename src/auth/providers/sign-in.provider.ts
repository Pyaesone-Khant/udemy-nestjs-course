import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        private readonly hashingProvider: HashingProvider
    ) { }

    public async singIn(signInDto: SignInDto) {
        // find user by email
        // throw an exception if user not found
        let user = await this.usersService.findOneByEmail(signInDto.email);

        // compare password
        let isEqual: boolean = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password)
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not compare password!"
            })
        }

        if (!isEqual) {
            throw new UnauthorizedException("Email or password is wrong!")
        }

        // send confirmation
        return {
            message: "User signed in successfully!",
            success: true
        }
    }

}
