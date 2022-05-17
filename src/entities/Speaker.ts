import { Column, Entity, OneToMany } from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';

@Entity()
export default class Speaker extends BaseEnt {
  @Column()
    name: string;

  @Column()
    description: string;

  @OneToMany(() => Activity, (act) => act.speaker)
    activities: Activity[];
}
