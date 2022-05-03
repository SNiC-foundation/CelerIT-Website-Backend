import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
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
