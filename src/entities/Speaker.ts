import { Column, Entity, OneToMany } from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';

export interface SpeakerParams {
  name: string;
  description: string;
}

@Entity()
export default class Speaker extends BaseEnt {
  @Column()
    name: string;

  @Column()
    description: string;

  @OneToMany(() => Activity, (act) => act.speaker, { nullable: true })
    activities: Activity[];
}
