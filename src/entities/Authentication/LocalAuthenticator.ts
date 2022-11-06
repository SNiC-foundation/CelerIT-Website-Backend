import {
  Column, Entity, PrimaryColumn, OneToOne, JoinColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import User from '../User';
import { BaseEntWithoutId } from '../BaseEnt';

export interface LocalAuthenticatorParams {
  user: User;
  verifiedEmail: boolean;
  hash: string;
  salt: string;
}

@Entity()
export default class LocalAuthenticator extends BaseEntWithoutId {
  @PrimaryColumn('uuid')
  public userId: number;

  @OneToOne(() => User, (user) => user.identity, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column()
    verifiedEmail!: boolean;

  @Column({ nullable: true })
    hash?: string;

  @Column()
    salt: string;
}
