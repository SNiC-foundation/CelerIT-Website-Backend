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
import MailTemplate from './MailTemplate';
import MailContent from './MailContent';

interface setPasswordReminderOptions {
  name: string;
  email: string,
  token: string,
  createDate: Date;
  url?: string;
}

const reminder = new MailContent<setPasswordReminderOptions>({
  getHTML: (context) => {
    const link = `${context.url}/reset-password?token=${context.token}&email=${context.email}`;
    return `
<p>Dear ${context.name},</p>
<p>On ${context.createDate.toLocaleDateString(undefined, { timeZone: 'Europe/Amsterdam' })}, you creating an account for the SNiC 2022: CelerIT website, probably to activate your ticket.
The creation process is however not yet finished, because you still need to set a password. To complete the process, use the following link any time within the next 24 hours: </p>
<p><a href="${link}">Reset Link</a></p>
<p>If this link somehow does not work, you can also request a password reset on the CelerIT website.</p>
<p>If you received this email, but did not buy a ticket for SNiC 2022: CelerIT, please contact us at info@celerit.nl.
It seems then that someone used the wrong email address for their ticket activation.</p>`;
  },
  getSubject: () => 'Please finish your ticket activation!',
  getText: (context) => `
Dear ${context.name},

On ${context.createDate.toLocaleDateString(undefined, { timeZone: 'Europe/Amsterdam' })}, you creating an account for the SNiC 2022: CelerIT website, probably to activate your ticket.
The creation process is however not yet finished, because you still need to set a password. To complete the process, use the following link any time within the next 24 hours: 

${context.url}/reset-password?token=${context.token}&email=${context.email}

If this link somehow does not work, you can also request a password reset on the CelerIT website.

If you received this email, but did not buy a ticket for SNiC 2022: CelerIT, please contact us at info@celerit.nl.
It seems then that someone used the wrong email address for their ticket activation.`,
});

export default class SetPasswordReminder extends MailTemplate<setPasswordReminderOptions> {
  public constructor(options: setPasswordReminderOptions) {
    const opt: setPasswordReminderOptions = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, reminder);
  }
}
