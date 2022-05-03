import {
  Column, Entity, JoinColumn, OneToOne, PrimaryColumn,
} from 'typeorm';
import { BaseEntWithoutID } from '../BaseEnt';
import User from '../User';

@Entity()
export default class LocalAuthenticator extends BaseEntWithoutID {
    @OneToOne(() => User, { nullable: false })
    @PrimaryColumn()
    @JoinColumn()
      user: User;

    @Column({})
      hash: string;

    @Column({})
      salt: string;
}
