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
import signature from './signature';
import MailContent from './MailContent';

interface RegisterUserWithPasswordReset {
  name: string;
  email: string,
  token: string,
  url?: string;
}

const registerParticipantWithPasswordReset = new MailContent<RegisterUserWithPasswordReset>({
  getHTML: (context) => `
<p>Dear ${context.name},</p>

<p>You have finished the first steps of creating your account for SNiC 2022: CelerIT.</p>

<p>To finish the creation process, you have to set a password by going to
    <a href="${context.url}/reset-password?token=${context.token}&email=${context.email}">${context.url}/reset-password?token=${context.token}&email=${context.email}</a>
. If this link has expired, you can reset your password on the website.</p>

<p>If your password is set, you can log in into the website.</p>

${signature}`,
  getSubject: () => 'Finish registering for SNiC 2022: CelerIT',
  getText: (context) => `
Dear ${context.name},

You have just finished the first steps of creating your account SNiC 2022: CelerIT.

To finish the activation process, you have to set a password by going to ${`${context.url}/reset-password?token=${context.token}&email=${context.email}`}. If this link has expired, you can reset your password on the website.

If your password is set, you can log in into the website.

Kind regards,
The SNiC 2022: CelerIT committee`,
});

export default class WelcomeWithReset extends MailTemplate<RegisterUserWithPasswordReset> {
  public constructor(options: RegisterUserWithPasswordReset) {
    const opt: RegisterUserWithPasswordReset = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, registerParticipantWithPasswordReset);
  }
}