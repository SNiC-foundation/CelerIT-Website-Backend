import {
  Column, Entity, OneToMany,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';

export interface ProgramPartParams {
  name: string;
  beginTime: Date;
  endTime: Date;
}

@Entity()
export default class ProgramPart extends BaseEnt {
  @Column()
    name: string;

  @Column()
    beginTime: Date;

  @Column()
    endTime: Date;

  @OneToMany(() => Activity, (a) => a.programPart)
    activities: Activity[];
}
