import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class PdfService {
  private compileTemplate(templateName: string, data: any): string {
    const filePath = path.join(
      process.cwd(),
      'src',
      'pdf',
      'templates',
      `${templateName}.hbs`,
    );

    const template = fs.readFileSync(filePath, 'utf-8');
    return handlebars.compile(template)(data);
  }

  async generate(transaction: any): Promise<Buffer> {
    const html = this.compileTemplate('receipt', {
      id: transaction.id,
      amount: transaction.amount.toString(),
      type: transaction.type,
      status: transaction.status,
      date: transaction.createdAt,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
    });

    await browser.close();

   return Buffer.from(pdf);
  }
}