import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import SubscribeActivity, { UpdateSubscribeActivityParams } from './SubscribeActivity';
// eslint-disable-next-line import/no-cycle
import Speaker from './Speaker';
import ProgramPart from './ProgramPart';

export interface ActivityParams {
  name: string;
  location: string;
  programPartId: number;
  description?: string;
  image?: string;
  speakerIds?: number[];
  subscribe?: UpdateSubscribeActivityParams;
}

@Entity()
export default class Activity extends BaseEnt {
  @Column()
    name: string;

  @Column()
    location: string;

  @Column({ nullable: false })
    programPartId: number;

  @ManyToOne(() => ProgramPart, { eager: true })
  @JoinColumn({ name: 'programPartId' })
    programPart: ProgramPart;

  @Column({ type: 'text', nullable: true })
    description?: string | null;

  @ManyToMany(() => Speaker)
  @JoinTable()
    speakers: Speaker[];

  @OneToOne(() => SubscribeActivity, (sub) => sub.activity, { nullable: true, cascade: ['insert', 'remove'] })
    subscribe?: SubscribeActivity | null;
}
