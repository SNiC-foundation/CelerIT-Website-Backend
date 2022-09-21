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
import MailTemplate from './mail-template';
import signature from './signature';
import MailContent from './mail-content';

interface WelcomeWithResetOptions {
  name: string;
  email: string,
  token: string,
  url?: string;
}

const welcomeWithReset = new MailContent<WelcomeWithResetOptions>({
  getHTML: (context) => `
<p>Dear ${context.name},</p>

<p>You have finished the first steps of activating your SNiC 2022: CelerIT ticket.</p>

<p>To finish the activation process, you have to set a password by going to ${`${context.url}/passwordreset?token=${context.token}&email=${context.email}`}. If this link has expired, you can reset your password on the website.</p>

<p>If your password is set, you can login into the website to register for the tracks. Note that this is only possible from October 31st onward!</p>

${signature}`,
  getSubject: () => 'Finish registering for SNiC 2022: CelerIT',
  getText: (context) => `
Dear ${context.name},

You have just finished the first steps of activating your SNiC 2022: CelerIT ticket.

To finish the activation process, you have to set a password by going to ${`${context.url}/passwordreset?token=${context.token}&email=${context.email}`}. If this link has expired, you can reset your password on the website.

If your password is set, you can login into the website to register for the tracks. Note that this is only possible from October 31st onward!

Kind regards,
The SNiC 2022: CelerIT committee`,
});

export default class WelcomeWithReset extends MailTemplate<WelcomeWithResetOptions> {
  public constructor(options: WelcomeWithResetOptions) {
    const opt: WelcomeWithResetOptions = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.SERVER_HOST;
    }
    super(opt, welcomeWithReset);
  }
}
