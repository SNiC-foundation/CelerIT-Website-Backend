import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import User from './User';

export interface UpdateParticipantParams {
  studyProgram: string;
}

export interface CreateParticipantParams extends UpdateParticipantParams {
  userId: number;
}

@Entity()
export default class Participant extends BaseEnt {
  @Column({ type: 'integer' })
    userId: number;

  @OneToOne(() => User, (user) => user.participantInfo, { eager: false, cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'userId' })
    user: User;

  @Column()
    studyProgram: string;
}
