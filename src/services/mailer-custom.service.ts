import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from 'src/modules/auth/entities/user.entity';

@Injectable()
export class MailerCustomService {
  constructor(private readonly mailerService: MailerService) {}

  #testEmailTemplate = `
  <table class="main" aria-label="email test">
  <tr>
    <td style="height: 8px; background-color: black"></td>
  </tr>
  <tr>
    <td style="text-align: center">
      <div style="display: inline-block; min-width: 50%; text-align: center">
        <h1 style="display: inline-block; margin: 1rem">MODERN</h1>
      </div>
      <div style="display: inline-block; min-width: 50%; text-align: center">
        <img
          src="https://randomuser.me/api/portraits/women/34.jpg"
          alt="logo"
          width="30px"
          style="margin-right: 1rem"
        />
        <img
          src="https://randomuser.me/api/portraits/women/34.jpg"
          alt="logo"
          width="30px"
          style="margin-right: 1rem"
        />
        <img
          src="https://randomuser.me/api/portraits/women/34.jpg"
          alt="logo"
          width="30px"
          style="margin-right: 1rem"
        />
        <img
          src="https://randomuser.me/api/portraits/women/34.jpg"
          alt="logo"
          width="30px"
          style="margin-right: 1rem"
        />
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <img
        src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
        alt="banner"
        width="600"
        style="max-width: 100%; aspect-ratio: 16/9"
      />
    </td>
  </tr>
  <tr>
    <td style="text-align: center">
      <div style="display: inline-block; max-width: 200px">
        <img
          src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
          width="130"
          alt="icon"
        />
        <br />
        <strong> title </strong>
        <p style="padding: 1rem">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
          dolores laboriosam vel asperiores
        </p>
      </div>
      <div style="display: inline-block; max-width: 200px">
        <img
          src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
          width="130"
          alt="icon"
        />
        <br />
        <strong> title </strong>
        <p style="padding: 1rem">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
          dolores laboriosam vel asperiores
        </p>
      </div>
      <div style="display: inline-block; max-width: 200px">
        <img
          src="https://unsplash.com/photos/AFR80W_pT8o/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Njl8fGVtYnJvaWRlcnl8ZW58MHx8fHwxNjQzNDY4NDc3&force=true&w=640"
          width="130"
          alt="icon"
        />
        <br />
        <strong> title </strong>
        <p style="padding: 1rem">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat
          dolores laboriosam vel asperiores
        </p>
      </div>
    </td>
  </tr>
  <tr style="background-color: black; color: white">
    <td>
      <div style="display: flex; justify-content: center; align-items: center">
        <img
          src="https://randomuser.me/api/portraits/women/34.jpg"
          alt="logo"
          width="260"
          style="padding: 1rem; max-width: 260px; aspect-ratio: 4/3"
        />
        <div style="width: 50%; padding: 1rem 2rem">
          <h3 style="display: inline-block">Title 1</h3>
          <span style="display: inline-block">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe,
            quos neque. Praesentium aperiam tempora assumenda blanditiis
          </span>
          <br />
          <br />

          <button
            style="
              padding: 0.5rem 1rem;
              background-color: white;
              border-radius: 1rem;
            "
          >
            Buy me
          </button>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div style="padding: 2rem; text-align: center">
        <h3 style="display: inline-block">Title Lorem ipsum</h3>
        <span style="display: inline-block">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, quos
          neque. Praesentium aperiam tempora assumenda blanditiis
        </span>
        <br />
        <br />

        <button
          style="
            padding: 0.5rem 1rem;
            color: white;
            background-color: black;
            border-radius: 1rem;
          "
        >
          Buy me
        </button>
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div
        style="
          background-color: #222;
          color: white;
          text-align: center;
          padding: 1rem 0;
        "
      >
        <h2>Modern</h2>
        <p>HTML Email Template</p>
        <p>Ambato - Ecuador</p>
        <div style="display: inline-block; min-width: 50%; text-align: center">
          <img
            src="https://randomuser.me/api/portraits/women/34.jpg"
            alt="logo"
            width="30px"
            style="margin-right: 1rem"
          />
          <img
            src="https://randomuser.me/api/portraits/women/34.jpg"
            alt="logo"
            width="30px"
            style="margin-right: 1rem"
          />
          <img
            src="https://randomuser.me/api/portraits/women/34.jpg"
            alt="logo"
            width="30px"
            style="margin-right: 1rem"
          />
          <img
            src="https://randomuser.me/api/portraits/women/34.jpg"
            alt="logo"
            width="30px"
            style="margin-right: 1rem"
          />
        </div>

        <p>Subscribe</p>
      </div>
    </td>
  </tr>
</table>
  `
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
      html: this.#testEmailTemplate, // HTML body content
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
