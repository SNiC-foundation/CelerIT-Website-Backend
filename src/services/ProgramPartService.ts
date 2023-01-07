import { Repository } from 'typeorm';
import ProgramPart, { ProgramPartParams } from '../entities/ProgramPart';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export interface getProgramPartParams {
  activity: boolean;
  subscribe: boolean;
}

export default class ProgramPartService {
  repo: Repository<ProgramPart>;

  constructor(repo?: Repository<ProgramPart>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(ProgramPart);
  }

  /**
   * Get all ProgramParts
   */
  public async getAllProgramParts(params?: getProgramPartParams): Promise<ProgramPart[]> {
    const relations: string[] = [];
    if (params?.activity) relations.push('activities');
    if (params?.subscribe) relations.push('activities.subscribe', 'activities.subscribe.subscribers');
    return this.repo.find({ relations });
  }

  /**
   * Get one ProgramPart
   * TODO: Add relations in findOne()
   */
  async getProgramPart(id: number, params?: getProgramPartParams): Promise<ProgramPart> {
    const relations: string[] = [];
    if (params?.activity) relations.push('activities');
    if (params?.subscribe) relations.push('activities.subscribe', 'activities.subscribe.subscribers');

    const programPart = await this.repo.findOne({ where: { id }, relations });
    if (programPart == null) {
      throw new ApiError(HTTPStatus.NotFound, 'ProgramPart not found');
    }
    return programPart;
  }

  /**
   * Create ProgramPart
   */
  createProgramPart(params: ProgramPartParams): Promise<ProgramPart> {
    const programPart = {
      ...params,
    } as any as ProgramPart;
    return this.repo.save(programPart);
  }

  /**
   * Update ProgramPart
   */
  async updateProgramPart(id: number, params: Partial<ProgramPartParams>): Promise<ProgramPart> {
    await this.repo.update(id, params);
    const programPart = await this.getProgramPart(id);

    if (programPart == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return programPart;
  }

  /**
   * Delete ProgramPart
   * TODO: Add relations in findOne()
   */
  async deleteProgramPart(id: number): Promise<void> {
    const programPart = await this.repo.findOne({ where: { id } });

    if (programPart == null) {
      throw new ApiError(HTTPStatus.NotFound, 'ProgramPart not found');
    }

    await this.repo.delete(programPart.id);
  }
}
