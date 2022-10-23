import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Role from './Role';
// eslint-disable-next-line import/no-cycle
import Participant, { UpdateParticipantParams } from './Participant';
// eslint-disable-next-line import/no-cycle
import Ticket from './Ticket';
// eslint-disable-next-line import/no-cycle
import Partner from './Partner';
// eslint-disable-next-line import/no-cycle
import SubscribeActivity from './SubscribeActivity';

export interface CreateParticipantUserParams {
  email: string;
  name: string;
  dietaryWishes: string;
  agreeToPrivacyPolicy: boolean;
  participantInfo: {
    studyProgram: string;
  }
}

export interface PersonalUserParams {
  name: string;
  dietaryWishes: string;
  participantInfo?: UpdateParticipantParams;
}

export interface UserParams extends PersonalUserParams {
  email: string;
  agreeToPrivacyPolicy: boolean;
  partnerId?: number | null;
}

@Entity()
export default class User extends BaseEnt {
  @Column({ unique: true })
    email: string;

  @Column()
    name: string;

  @Column({ default: false })
    emailVerified: boolean;

  @Column({ type: 'text', default: '' })
    dietaryWishes: string;

  @Column()
    agreeToPrivacyPolicy: boolean;

  @OneToOne(() => Participant, (participant) => participant.user, { nullable: true, eager: true, cascade: ['insert', 'update', 'remove'] })
    participantInfo?: Participant;

  @ManyToMany(() => Role)
  @JoinTable()
    roles: Role[];

  @OneToOne(() => Ticket, (ticket) => ticket.user, { nullable: true, onDelete: 'SET NULL' })
    ticket?: Ticket;

  @Column({ nullable: true })
    partnerId?: number | null;

  @ManyToOne(() => Partner, { nullable: true })
  @JoinColumn({ name: 'partnerId' })
    partner?: Partner | null;

  @ManyToMany(() => SubscribeActivity, (act) => act.subscribers)
  @JoinTable()
    subscriptions: SubscribeActivity[];
}
