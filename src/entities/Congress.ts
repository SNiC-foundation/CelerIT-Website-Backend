import {
  Column, Entity, ManyToMany, OneToMany,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Partner from './Partner';
// eslint-disable-next-line import/no-cycle
import ProgramPart from './ProgramPart';

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
    partners: Partner[];

  @OneToMany(() => ProgramPart, (part) => part.congress)
    program: ProgramPart[];
}
