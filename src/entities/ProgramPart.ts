import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Congress from './Congress';

@Entity()
export default class ProgramPart extends BaseEnt {
  @Column()
    beginTime: Date;

  @Column()
    endTime: Date;

  @Column({ type: 'integer' })
    congressId: number;

  @ManyToOne(() => Congress)
  @JoinColumn({ name: 'congressId' })
    congress: Congress;
}
