import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './providers/mail.service';

@Global()
@Module({
    providers: [MailService],
    exports: [MailService],
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get("appConfig.mailHost"),
                    secure: false,
                    port: 2525,
                    auth: {
                        user: configService.get("appConfig.smtpUsername"),
                        pass: configService.get("appConfig.smtpPassword"),
                    }
                },
                defaults: {
                    from: `My Blog <no-reply@udemy-nestjs-course.com>`
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: false,
                    }
                }
            })
        })
    ]
})
export class MailModule { }
