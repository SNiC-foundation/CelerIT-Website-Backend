/**
 *  SudoSOS back-end API service.
 *  Copyright (C) 2020  Study association GEWIS
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import Mail from 'nodemailer/lib/mailer';
import * as fs from 'fs';
import path from 'path';
import MailContent from './MailContent';

export default class MailTemplate<T> {
  protected baseMailOptions: Mail.Options = {
    from: process.env.SMTP_FROM,
  };

  protected contentOptions: T;

  protected mailContent: MailContent<T>;

  public constructor(options: T, mailContent: MailContent<T>) {
    this.contentOptions = options;
    this.mailContent = mailContent;
  }

  /**
   * Get the base options
   */
  getOptions(): Mail.Options {
    const { text, html, subject } = this.mailContent.getContent(this.contentOptions);

    let htmlTemplate = fs.readFileSync(path.join(__dirname, '../../../static/container.html')).toString();
    htmlTemplate = htmlTemplate.replaceAll('{{url}}', process.env.URL || '');
    htmlTemplate = htmlTemplate.replaceAll('{{title}}', subject || '');
    htmlTemplate = htmlTemplate.replace('{{content}}', html);

    let textTemplate = fs.readFileSync(path.join(__dirname, '../../../static/container.txt')).toString();
    textTemplate = textTemplate.replace('{{content}}', text);

    return {
      ...this.baseMailOptions,
      text: textTemplate,
      html: htmlTemplate,
      subject,
    };
  }
}
