import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

export interface ProgramPartParams {
  beginTime: Date;
  endTime: Date;
}

@Entity()
export default class ProgramPart extends BaseEnt {
  @Column()
    beginTime: Date;

  @Column()
    endTime: Date;
}
