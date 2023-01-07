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

interface WelcomeWithResetOptions {
  name: string;
  email: string,
  token: string,
  url?: string;
}

const passwordReset = new MailContent<WelcomeWithResetOptions>({
  getHTML: (context) => {
    const link = `${context.url}/reset-password?token=${context.token}&email=${context.email}`;
    return `
<p>Dear ${context.name},</p>
<p>A password reset for this email address has been requested. To complete the process, use the following link any time within the next 60 minutes: </p>
<p><a href="${link}">Reset Link</a></p>
<p>If this link somehow does not work, you have to request a new password reset on the CelerIT website again.</p>
<p>If you have not requested a password reset, you can safely ignore this email and use your current login information.</p>`;
  },
  getSubject: () => 'Password reset',
  getText: (context) => `
Dear ${context.name},

A password reset for this email address has been requested. To complete the process, use the following link any time within the next 60 minutes: 

${context.url}/reset-password?token=${context.token}&email=${context.email}

If this link somehow does not work, you have to request a new password reset on the CelerIT website again.

If you have not requested a password reset, you can safely ignore this email and use your current login information.`,
});

export default class PasswordReset extends MailTemplate<WelcomeWithResetOptions> {
  public constructor(options: WelcomeWithResetOptions) {
    const opt: WelcomeWithResetOptions = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, passwordReset);
  }
}
