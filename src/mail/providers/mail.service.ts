import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {

    constructor(
        private mailerServive: MailerService
    ) { }

    async sendWelcomeMail(user: User): Promise<void> {
        await this.mailerServive.sendMail({
            to: user.email,
            subject: `Welcome to Udemy NestJS Course`,
            template: './welcome',
            context: {
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                loginUrl: 'http://localhost:3000/auth/sign-in'
            }
        })
    }

}
