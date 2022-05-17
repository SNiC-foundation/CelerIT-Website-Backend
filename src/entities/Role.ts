import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEnt';

@Entity()
export default class Role extends BaseEnt {
  @Column({ unique: true })
    name: string;
}
