import {
  Column, Entity, JoinTable, ManyToMany, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Role from './Role';
// eslint-disable-next-line import/no-cycle
import Participant from './Participant';

export interface UserParams {
  email: string;
  name: string;
  dietaryWishes: string;
  agreeToPrivacyPolicy: boolean;
}

@Entity()
export default class User extends BaseEnt {
  @Column({ unique: true })
    email: string;

  @Column()
    name: string;

  @Column({ default: '' })
    dietaryWishes: string;

  @Column()
    agreeToPrivacyPolicy: boolean;

  @OneToOne(() => Participant, (participant) => participant.user)
    participantInfo: Participant;

  @ManyToMany(() => Role)
  @JoinTable()
    roles: Role[];
}
