import { Repository } from 'typeorm';
import Speaker, { SpeakerParams } from '../entities/Speaker';
import AppDataSource from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class SpeakerService {
  repo: Repository<Speaker>;

  constructor(repo?: Repository<Speaker>) {
    this.repo = repo !== undefined ? repo : AppDataSource.getRepository(Speaker);
  }

  /**
   * Get all Speakers
   */
  public async getAllSpeakers(): Promise<Speaker[]> {
    return this.repo.find();
  }

  /**
   * Get one Speaker
   * TODO: Add relations in findOne()
   */
  async getSpeaker(id: number): Promise<Speaker> {
    const speaker = await this.repo.findOne({ where: { id } });
    if (speaker == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Speaker not found');
    }
    return speaker;
  }

  /**
   * Create Speaker
   */
  createSpeaker(params: SpeakerParams): Promise<Speaker> {
    const speaker = {
      ...params,
    } as any as Speaker;
    return this.repo.save(speaker);
  }

  /**
   * Update Speaker
   */
  async updateSpeaker(id: number, params: Partial<SpeakerParams>): Promise<Speaker> {
    await this.repo.update(id, params);
    const speaker = await this.getSpeaker(id);

    if (speaker == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return speaker;
  }

  /**
   * Delete Speaker
   * TODO: Add relations in findOne()
   */
  async deleteSpeaker(id: number): Promise<void> {
    const speaker = await this.repo.findOne({ where: { id } });

    if (speaker == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Speaker not found');
    }

    await this.repo.delete(speaker.id);
  }
}
