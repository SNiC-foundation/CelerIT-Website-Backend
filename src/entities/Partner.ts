import {
  Column, Entity, JoinTable, ManyToMany,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Congress from './Congress';

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

  @ManyToMany(() => Congress)
  @JoinTable()
    congresses: Congress[];
}
