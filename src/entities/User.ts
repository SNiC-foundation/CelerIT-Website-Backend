import {
  Column, Entity, JoinTable, ManyToMany, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Role from './Role';
// eslint-disable-next-line import/no-cycle
import Participant, { UpdateParticipantParams } from './Participant';
// eslint-disable-next-line import/no-cycle
import Ticket from './Ticket';

export interface CreateParticipantUserParams {
  email: string;
  name: string;
  dietaryWishes: string;
  agreeToPrivacyPolicy: boolean;
  participantInfo: {
    studyProgram: string;
  }
}

export interface UserParams {
  email: string;
  name: string;
  dietaryWishes: string;
  agreeToPrivacyPolicy: boolean;
  participantInfo?: UpdateParticipantParams;
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

  @OneToOne(() => Ticket, (ticket) => ticket.user, { nullable: true })
    ticket?: Ticket;
}
