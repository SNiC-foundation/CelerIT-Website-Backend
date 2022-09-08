import { Repository } from 'typeorm';
import Participant, { CreateParticipantParams, UpdateParticipantParams } from '../entities/Participant';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class ParticipantService {
  repo: Repository<Participant>;

  constructor(repo?: Repository<Participant>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Participant);
  }

  /**
   * Get all Participants
   */
  public async getAllParticipants(): Promise<Participant[]> {
    return this.repo.find();
  }

  /**
   * Get one Participant
   * TODO: Add relations in findOne()
   */
  async getParticipant(id: number): Promise<Participant> {
    const participant = await this.repo.findOne({ where: { id } });
    if (participant == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Participant not found');
    }
    return participant;
  }

  /**
   * Create Participant
   */
  createParticipant(params: CreateParticipantParams): Promise<Participant> {
    const participant = {
      ...params,
    } as any as Participant;
    return this.repo.save(participant);
  }

  /**
   * Update Participant
   */
  async updateParticipant(id: number, params: Partial<UpdateParticipantParams>): Promise<Participant> {
    await this.repo.update(id, params);
    const participant = await this.getParticipant(id);

    if (participant == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return participant;
  }

  /**
   * Delete Participant
   * TODO: Add relations in findOne()
   */
  async deleteParticipant(id: number): Promise<void> {
    const participant = await this.repo.findOne({ where: { id } });

    if (participant == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Participant not found');
    }

    await this.repo.delete(participant.id);
  }
}
