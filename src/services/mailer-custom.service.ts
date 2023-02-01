import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/modules/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerCustomService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public sendMail(user: User): void {
    const { username, email } = user;
    const htmlDefaultTemplate = `
    <div>
    gracias ${username}.
    <br>
    por favor confirma tu correo.
    <br>
    <a name="" id="" class="btn btn-primary" href="https://wwbot.netlify.app/#/auth" role="button"> Confirm email </a>
    </div>
  `;
    this.mailerService
      .sendMail({
        to: email, // list of receivers
        from: this.configService.get('Email'), // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: htmlDefaultTemplate, // HTML body content
      })
      .then(() => null)
      .catch((err) => {
        console.log(err);
      });
  }

  confirmEmail(user: User) {
    const { username, email } = user;
    const htmlDefaultTemplate = `
    <div>
    gracias ${username}.
    <br>
    por favor confirma tu correo.
    <br>
    <a name="" id="" class="btn btn-primary" href="https://wwbot.netlify.app/#/auth" role="button"> Confirm email </a>
    </div>
  `;
    this.mailerService
      .sendMail({
        to: email, // list of receivers
        from: this.configService.get('Email'), // sender address
        subject: 'Email Confirmation', // Subject line
        text: 'Welcome!', // plaintext body
        html: htmlDefaultTemplate, // HTML body content
      })
      .then(() => null)
      .catch((err) => {
        console.log(err);
      });
  }
}
