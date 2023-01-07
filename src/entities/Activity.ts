import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import SubscribeActivity, { UpdateSubscribeActivityParams } from './SubscribeActivity';
// eslint-disable-next-line import/no-cycle
import Speaker from './Speaker';
// eslint-disable-next-line import/no-cycle
import ProgramPart from './ProgramPart';

export interface ActivityParams {
  name: string;
  location: string;
  programPartId: number;
  description?: string;
  recordingUrl?: string;
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

  @ManyToOne(() => ProgramPart, (p) => p.activities, { eager: true })
  @JoinColumn({ name: 'programPartId' })
    programPart: ProgramPart;

  @Column({ type: 'text', nullable: true })
    description?: string | null;

  @Column({ nullable: true })
    recordingUrl?: string;

  @ManyToMany(() => Speaker, (speaker) => speaker.activities)
  @JoinTable()
    speakers: Speaker[];

  @OneToOne(() => SubscribeActivity, (sub) => sub.activity, { nullable: true, cascade: ['insert', 'remove'] })
    subscribe?: SubscribeActivity | null;
}
