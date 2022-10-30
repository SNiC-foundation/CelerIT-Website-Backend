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

interface TicketActivatedParams {
  name: string;
  ticketCode: string;
  url?: string;
}

const ticketActivated = new MailContent<TicketActivatedParams>({
  getHTML: (context) => `
    <p>Dear ${context.name},</p>
    <p>We are happy to welcome you to CelerIT on the 30th of November!</p>
    <p>Your ticket code is: ${context.ticketCode}.</p>
    <p><img src="${context.url}/api/static/barcodes/${context.ticketCode}.png" alt="${context.ticketCode}"/></p>
    <p>Please bring this barcode to the conference.</p>
    <p>Before the conference starts you need to perform a few actions. Please read this email carefully.</p>
    <p>Firstly, please make sure your personal information is up to date and correct, your name will be used for a personal name badge. If applicable, also make sure to update your allergy information before the 14th of November. There will be sufficient vegetarian options available by default.</p>
    <p>Secondly, starting from Monday 31st of October at 12:00 the subscriptions will open for the conference program. You can find the program <a href="https://www.celerit.nl/program">here</a>. You can choose yourself what talks you want to visit. For the first time during SNiC we are also offering the option to join an interactive business case! The first business case is about the security of IoT devices provided by TU/e lecturer Savio Sciancalepore. The second business case is about how to approach coding assessment during job applications provided by ING. Additionally we offer 3 speeddate sessions, here you get the option to talk one on one with engineers and recruiters from interesting companies. The speeddates are most interesting for master students, or bachelor students looking for a graduate job. The companies joining the speeddate this year are: Booking.com, Nedap, Chipsoft, Topdesk and DSW.</p>
    <p>Please subscribe before the 14th of November to get a personal program. If you have not subscribed for all rounds by then, you will be randomly assigned to the remaining spots.</p>
    <p>Lunch, dinner and drinks are all included in the price, you do not need to bring any food. Additionally, the conference does not require you to bring a bag or a laptop. Also, note that this is a serious activity so please dress appropriately.</p>
    <p>We look forward to seeing you at CelerIT!</p>`,
  getSubject: () => 'Important information regarding the SNiC 2022 CelerIT conference',
  getText: (context) => `
Dear ${context.name},

We are happy to welcome you to CelerIT on the 30th of November!

Your ticket code is: ${context.ticketCode}. Please bring this code to the conference.

Before the conference starts you need to perform a few actions. Please read this email carefully.

Firstly, please make sure your personal information is up to date and correct, your name will be used for a personal name badge. If applicable, also make sure to update your allergy information before the 14th of November. There will be sufficient vegetarian options available by default.

Secondly, starting from Monday 31st of October at 12:00 the subscriptions will open for the conference program. You can find the program on our website: www.celerit.nl. You can choose yourself what talks you want to visit. For the first time during SNiC we are also offering the option to join an interactive business case! The first business case is about the security of IoT devices provided by TU/e lecturer Savio Sciancalepore. The second business case is about how to approach coding assessment during job applications provided by ING. Additionally we offer 3 speeddate sessions, here you get the option to talk one on one with engineers and recruiters from interesting companies. The speeddates are most interesting for master students, or bachelor students looking for a graduate job. The companies joining the speeddate this year are: Booking.com, Nedap, Chipsoft, Topdesk and DSW.

Please subscribe before the 14th of November to get a personal program. If you have not subscribed for all rounds by then, you will be randomly assigned to the remaining spots.

Lunch, dinner and drinks are all included in the price, you do not need to bring any food. Additionally, the conference does not require you to bring a bag or a laptop. Also, note that this is a serious activity so please dress appropriately.

We look forward to seeing you at CelerIT!`,
});

export default class TicketActivated extends MailTemplate<TicketActivatedParams> {
  public constructor(options: TicketActivatedParams) {
    const opt: TicketActivatedParams = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, ticketActivated);
  }
}
