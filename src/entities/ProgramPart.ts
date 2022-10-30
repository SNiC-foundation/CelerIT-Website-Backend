import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

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
}
