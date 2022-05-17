import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import User from './User';

@Entity()
export default class Participant extends BaseEnt {
  @Column({ type: 'integer' })
    userId: number;

  @OneToOne(() => User)
  @JoinColumn()
    user: User;

  @Column({ nullable: true })
    studyAssociation?: string;

  @Column({ nullable: true })
    studyProgram?: string;

  @Column({ nullable: true })
    agreeToSharingWithCompanies?: boolean;
}
