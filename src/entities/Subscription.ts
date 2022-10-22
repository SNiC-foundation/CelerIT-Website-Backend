import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

export interface SubscriptionParams {
  subscribeActivityId: number;
  userId: number,
}

@Entity()
export default class Subscription extends BaseEnt {
  @Column({ type: 'integer' })
    subscribeActivityId: number;

  @Column({ type: 'integer' })
    userId: number;
}
