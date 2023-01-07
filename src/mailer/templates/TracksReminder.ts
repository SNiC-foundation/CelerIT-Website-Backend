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

interface TracksReminderOptions {
  name: string;
  url?: string;
}

const reminder = new MailContent<TracksReminderOptions>({
  getHTML: (context) => `
<p>Dear ${context.name},</p>
<p>On Monday the 31st of October, the subscriptions for the tracks of SNiC 2022: CelerIT opened.
According to our administration, you are still missing at least one subscription for a track.
You can subscribe to the different tracks at <a href="${context.url}/program">${context.url}/program</a>.
Please do so before the subscription deadline of November 14!</p>
<p>Thank you!</p>`,
  getSubject: () => 'Reminder to subscribe for the tracks',
  getText: (context) => `
Dear ${context.name},

On Monday the 31st of October, the subscriptions for the tracks of SNiC 2022: CelerIT opened.
According to our administration, you are still missing at least one subscription for a track.
You can subscribe to the different tracks at <a href="${context.url}/program">${context.url}/program</a>.
Please do so before the subscription deadline of November 14!

Thank you!`,
});

export default class TracksReminder extends MailTemplate<TracksReminderOptions> {
  public constructor(options: TracksReminderOptions) {
    const opt: TracksReminderOptions = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, reminder);
  }
}
