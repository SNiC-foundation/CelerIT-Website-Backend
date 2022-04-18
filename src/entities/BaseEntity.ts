import {
  CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn,
} from 'typeorm';

export default class BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @CreateDateColumn({ update: false })
  readonly createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @VersionColumn()
    version: number;
}
