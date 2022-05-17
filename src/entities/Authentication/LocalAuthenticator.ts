import {
  Column, Entity, PrimaryColumn, OneToOne, JoinColumn,
} from 'typeorm';
import User from '../User';
import { BaseEntWithoutId } from '../BaseEntity';

@Entity('LocalAuthenticator')
export default class LocalAuthenticator extends BaseEntWithoutId {
  @PrimaryColumn('uuid')
  public userId: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column()
    hash: string;

  @Column()
    salt: string;
}
