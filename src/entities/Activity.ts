import {
  Column, Entity, JoinColumn, ManyToOne, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import SubscribeActivity from './SubscribeActivity';
// eslint-disable-next-line import/no-cycle
import Speaker from './Speaker';
import ProgramPart from './ProgramPart';

export interface ActivityParams {
  name: string;
  location: string;
  programPartId: number;
  description?: string;
  image?: string;
  maxParticipants?: number;
  speakerId?: number;
}

@Entity()
export default class Activity extends BaseEnt {
  @Column()
    name: string;

  @Column()
    location: string;

  @Column({ nullable: false })
    programPartId: number;

  @ManyToOne(() => ProgramPart)
  @JoinColumn({ name: 'programPartId' })
    programPart: ProgramPart;

  @Column({ nullable: true })
    description?: string;

  @Column({ nullable: true })
    image?: string;

  @Column({ nullable: true, type: 'integer' })
    maxParticipants?: number;

  @Column({ nullable: true, type: 'integer' })
    speakerId?: number;

  @ManyToOne(() => Speaker, { nullable: true })
  @JoinColumn({ name: 'speakerId' })
    speaker?: Speaker;

  @OneToOne(() => SubscribeActivity, (sub) => sub.activity, { nullable: true })
    subscribe?: SubscribeActivity;
}
