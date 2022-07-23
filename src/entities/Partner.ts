import {
  Column, Entity, JoinTable, ManyToMany,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Participant from './Participant';

export interface PartnerParams {
  name: string;
  location: string;
  specialization: string;
  description: string;
  url: string;
}

export interface QRParams {
  encryptedId: string;
}

@Entity()
export default class Partner extends BaseEnt {
  @Column()
    name: string;

  @Column()
    location: string;

  @Column()
    specialization: string;

  @Column()
    description: string;

  @Column()
    url: string;

  @ManyToMany(() => Participant)
  @JoinTable()
    participants: Participant[];
}
