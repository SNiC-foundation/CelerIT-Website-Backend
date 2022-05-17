import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

@Entity()
export default class ProgramPart extends BaseEnt {
  @Column()
    beginTime: Date;

  @Column()
    endTime: Date;
}
