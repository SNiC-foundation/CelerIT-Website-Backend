import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import User from './User';

export interface ParticipantParams {
  userId: number;
  studyAssociation?: string;
  studyProgram?: string;
  agreeToSharingWithCompanies?: boolean;
}

@Entity()
export default class Participant extends BaseEnt {
  @Column({ type: 'integer' })
    userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
    user: User;

  @Column({ nullable: true })
    studyAssociation?: string;

  @Column({ nullable: true })
    studyProgram?: string;

  @Column({ nullable: true })
    agreeToSharingWithCompanies?: boolean;
}
