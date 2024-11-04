import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dtos/signin.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("sign-in")
    @HttpCode(HttpStatus.OK)
    @Auth(AuthType.None)
    public async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }
}
