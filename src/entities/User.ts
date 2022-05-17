import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEntity';

export interface UserParams {
  email: string;
  name: string;
}

@Entity('User')
export default class User extends BaseEnt {
  @Column({ unique: true })
    email: string;

  @Column({})
    name: string;
}
