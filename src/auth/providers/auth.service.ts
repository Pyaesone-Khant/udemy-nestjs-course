import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService
    ) { }

    public login(email: string, password: string) {
        const user = this.userService.findOne(1)
    }

    public isAuthenticated() {
        return true;
    }
}
