import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEnt';

export interface UserParams {
  email: string;
  name: string;
}

@Entity()
export default class User extends BaseEnt {
  @Column({ unique: true })
    email: string;

  @Column({})
    name: string;
}
