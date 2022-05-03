import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEnt';

@Entity()
export default class Activity extends BaseEnt {
  @Column()
    name: string;

  @Column()
    location: string;

  @Column({ nullable: true })
    description?: string;

  @Column({ nullable: true })
    image?: string;

  @Column({ nullable: true, type: 'integer' })
    maxParticipants?: number;
}
