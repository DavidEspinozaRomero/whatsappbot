import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from 'src/modules/auth/entities/user.entity';

@Injectable()
export class MailerCustomService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail() {
    // const { username, email } = user;
    const htmlDefaultTemplate = `
    <div>
  <p>
    Gracias .
    <br />
    Por favor confirma tu correo.
  </p>

  <a
    name=""
    id=""
    class="btn btn-primary"
    href="https://wwbot.netlify.app/#/auth"
    role="button"
  >
    <button
      type="button"
      style="padding: 0.5rem 1rem; color: snow; background-color: blue"
    >
      Confirmar email
    </button>
  </a>
</div>
  `;
    const mailOptions = {
      to: 'deerhou@gmail.com', // list of receivers
      from: 'deerhou@gmail.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      // text: 'welcome', // plaintext body
      html: htmlDefaultTemplate, // HTML body content
    };
    this.mailerService
      .sendMail(mailOptions)
      .then(() => null)
      .catch((err) => {
        console.log(err);
      });
  }

  // confirmEmail(user: User) {
  //   const { username, email } = user;
  //   const htmlDefaultTemplate = `
  //   <div>
  //   gracias ${username}.
  //   <br>
  //   por favor confirma tu correo.
  //   <br>
  //   <a name="" id="" class="btn btn-primary" href="https://wwbot.netlify.app/#/auth" role="button"> Confirm email </a>
  //   </div>
  // `;
  //   this.mailerService
  //     .sendMail({
  //       to: email, // list of receivers
  //       from: this.configService.get('Email'), // sender address
  //       subject: 'Email Confirmation', // Subject line
  //       text: 'Welcome!', // plaintext body
  //       html: htmlDefaultTemplate, // HTML body content
  //     })
  //     .then(() => null)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
}
