import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';
import User from './User';

@Entity()
export default class SubscribeActivity extends BaseEnt {
  @Column({ type: 'integer' })
    activityId: number;

  @OneToOne(() => Activity)
  @JoinColumn({ name: 'activityId' })
    activity: Activity;

  @Column({ type: 'integer' })
    maxParticipants: number;

  @Column()
    subscriptionListOpenDate: Date;

  @Column()
    subscriptionListCloseDate: Date;

  @ManyToMany(() => User)
  @JoinTable()
    subscribers: User[];
}
