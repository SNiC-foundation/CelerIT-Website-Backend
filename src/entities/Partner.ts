import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

@Entity()
export default class Partner extends BaseEnt {
  @Column()
    name: string;

  @Column()
    location: string;

  @Column()
    specialization: string;

  @Column()
    description: string;

  @Column()
    url: string;
}
