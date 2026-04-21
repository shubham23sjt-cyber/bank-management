import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  private compileTemplate(templateName: string, data: any): string {
    const filePath = path.join(
      process.cwd(),
      'src',
      'email',
      'templates',
      `${templateName}.hbs`,
    );

    const template = fs.readFileSync(filePath, 'utf-8');
    return handlebars.compile(template)(data);
  }

  async sendMail(
    to: string,
    template: string,
    data: any,
    attachment?: Buffer,
  ) {
    const html = this.compileTemplate(template, data);

    await this.transporter.sendMail({
      from: '"Bank App" <no-reply@bank.com>',
      to,
      subject: 'Transaction Notification',
      html,
      attachments: attachment
        ? [
            {
              filename: 'receipt.pdf',
              content: attachment,
            },
          ]
        : [],
    });
  }
}