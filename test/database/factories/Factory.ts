import { Repository } from 'typeorm';
import BaseEnt from '../../../src/entities/BaseEnt';

abstract class Factory<T extends BaseEnt> {
  protected repo: Repository<T>;

  public abstract createSingle(): Promise<T>;

  // eslint-disable-next-line no-unused-vars
  public abstract createMultiple(amount: number): Promise<T[]>;
}

export default Factory;
