import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEnt';

@Entity()
export default class Speaker extends BaseEnt {
  @Column()
    name: string;

  @Column()
    description: string;
}
