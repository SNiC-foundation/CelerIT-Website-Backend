import { Column, Entity, ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm/browser';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Partner from './Partner';

@Entity()
export default class Congress extends BaseEnt {
  @Column()
    name: string;

  @Column({ type: 'text' })
    logo: string;

  @Column()
    date: Date;

  @Column()
    location: string;

  @Column()
    contactInfo: string;

  @ManyToMany(() => Partner)
  @JoinTable()
    partners: Partner[];
}
