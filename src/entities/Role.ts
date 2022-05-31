import { Column, Entity } from 'typeorm';
import BaseEnt from './BaseEnt';

export interface RoleParams {
    name: string;
}
@Entity()
export default class Role extends BaseEnt {
  @Column({ unique: true })
    name: string;
}
