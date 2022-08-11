import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import User from './User';

export interface TicketParams {
    association: string;
}

@Entity('Ticket')
export default class Ticket extends BaseEnt {
    @Column({ type: 'integer', nullable: true })
      userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
      user: User;

    @Column({ default: '' })
      association: string;

    @Column()
      code: string;
}
