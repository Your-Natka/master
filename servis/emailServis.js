import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import path from "path";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  // #initTransport - experimental private js method
  _initTransport() {
    const transportConfig =
      process.env.NODE_ENV === "production"
        ? {
            // MAILGUN
            host: process.env.MAILGUN_HOST,
            port: +process.env.MAILGUN_PORT,
            auth: {
              user: process.env.MAILGUN_USER,
              pass: process.env.MAILGUN_PASS,
            },
          }
        : {
            // MAILTRAP test service
            host: process.env.MAILTRAP_HOST,
            port: +process.env.MAILTRAP_PORT,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS,
            },
          };

    return nodemailer.createTransport(transportConfig);
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(process.cwd(), "views", "emails", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send("hello", "Welcome email");
  }

  async passwordReset() {
    await this._send("passwordReset", "Password reset instructions");
  }
}
