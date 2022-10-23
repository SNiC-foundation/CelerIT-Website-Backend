import {
  Column, Entity, JoinTable, ManyToMany,
} from 'typeorm';
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

  @Column({ type: 'text' })
    description: string;

  @ManyToMany(() => Activity, (act) => act.speakers)
  @JoinTable()
    activities: Activity[];

  @Column({ nullable: true })
    imageFilename?: string;
}
