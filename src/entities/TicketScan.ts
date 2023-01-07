import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Ticket from './Ticket';
// eslint-disable-next-line import/no-cycle
import User from './User';

@Entity()
export default class TicketScan extends BaseEnt {
  @Column()
    ticketId: number;

  @Column()
    userId: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.scans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
    ticket: Ticket;

  @ManyToOne(() => User, (user) => user.scans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    user: User;
}
