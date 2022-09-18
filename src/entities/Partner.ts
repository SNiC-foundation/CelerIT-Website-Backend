import {
  Column, Entity,
} from 'typeorm';
import BaseEnt from './BaseEnt';

export enum SponsorPackage {
  // eslint-disable-next-line no-unused-vars
  BRONZE = 'bronze',
  // eslint-disable-next-line no-unused-vars
  SILVER = 'silver',
  // eslint-disable-next-line no-unused-vars
  GOLD = 'gold',
  // eslint-disable-next-line no-unused-vars
  PLATINUM = 'platinum',
}

export interface PartnerParams {
  name: string;
  location: string;
  specialization: string;
  description: string;
  url: string;
  package: SponsorPackage;
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

  @Column()
    package: SponsorPackage;

  @Column({ nullable: true })
    logoFilename?: string;
}
