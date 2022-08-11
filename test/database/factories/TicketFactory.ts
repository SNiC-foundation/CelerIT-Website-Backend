import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import crypto from 'crypto';
import Factory from './Factory';
import Ticket from '../../../src/entities/Ticket';
import User from '../../../src/entities/User';

export default class TicketFactory extends Factory<Ticket> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(Ticket);
  }

  private constructObject(association?: string): Ticket {
    return Object.assign(new Ticket(), {
      association: association ?? faker.company.companyName(),
      code: crypto.randomBytes(16).toString('hex'),
    });
  }

  async createSingle(): Promise<Ticket> {
    const ticket = this.constructObject();
    return this.repo.save(ticket);
  }

  async createSingleWithUser(user: User): Promise<Ticket> {
    const ticket = await this.createSingle();
    ticket.userId = user.id;
    await this.repo.save(ticket);
    return ticket;
  }

  createMultiple(amount: number): Promise<Ticket[]> {
    const tickets: Ticket[] = [];

    for (let i = 0; i < amount; i += 1) {
      tickets.push(this.constructObject());
    }

    return this.repo.save(tickets);
  }
}
