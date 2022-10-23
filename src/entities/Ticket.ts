import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import User from './User';

export interface TicketParams {
    association: string;
}

@Entity()
export default class Ticket extends BaseEnt {
    @Column({ type: 'integer', nullable: true })
      userId?: number | null;

    @OneToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
      user?: User | null;

    @Column({ default: '' })
      association: string;

    @Column({ unique: true })
      code: string;
}
