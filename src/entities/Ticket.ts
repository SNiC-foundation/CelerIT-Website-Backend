import {
  Column, Entity, JoinColumn, OneToMany, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import User from './User';
// eslint-disable-next-line import/no-cycle
import TicketScan from './TicketScan';

export interface TicketParams {
    association: string;
}

@Entity()
export default class Ticket extends BaseEnt {
  @Column({ type: 'integer', nullable: true })
    userId?: number | null;

  @OneToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
    user?: User | null;

  @Column({ default: '' })
    association: string;

  @Column({ unique: true })
    code: string;

  @OneToMany(() => TicketScan, (scan) => scan.ticket)
    scans: TicketScan[];
}
