import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';
import User from './User';

export interface UpdateSubscribeActivityParams {
  maxParticipants: number;
  subscriptionListOpenDate: Date;
  subscriptionListCloseDate: Date;
}

export interface CreateSubscribeActivityParams extends UpdateSubscribeActivityParams {
  activityId: number;
}

@Entity()
export default class SubscribeActivity extends BaseEnt {
  @Column({ type: 'integer' })
    activityId: number;

  @OneToOne(() => Activity, { cascade: ['insert'] })
  @JoinColumn({ name: 'activityId' })
    activity: Activity;

  @Column({ type: 'integer' })
    maxParticipants: number;

  @Column()
    subscriptionListOpenDate: Date;

  @Column()
    subscriptionListCloseDate: Date;

  @ManyToMany(() => User, { onDelete: 'RESTRICT' })
  @JoinTable()
    subscribers: User[];
}
