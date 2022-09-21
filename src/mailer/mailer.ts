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
import { Transporter } from 'nodemailer';
import createSMTPTransporter from './transporter';
import MailTemplate from './templates/mail-template';
import User from '../entities/User';

export default class Mailer {
  // eslint-disable-next-line no-use-before-define
  private static instance: Mailer;

  private transporter: Transporter;

  constructor() {
    this.transporter = createSMTPTransporter();
  }

  static getInstance(): Mailer {
    if (this.instance === undefined) {
      this.instance = new Mailer();
    }
    return this.instance;
  }

  async send<T>(to: User, template: MailTemplate<T>) {
    try {
      await this.transporter.sendMail({
        ...template.getOptions(),
        to: to.email,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
