import { Repository } from 'typeorm';
import * as forge from 'node-forge';
import Participant, { ParticipantParams } from '../entities/Participant';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';
import keys from '../qrcodes/keys.json';

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
  createParticipant(params: ParticipantParams): Promise<Participant> {
    const participant = {
      ...params,
    } as any as Participant;
    return this.repo.save(participant);
  }

  /**
   * Update Participant
   */
  async updateParticipant(id: number, params: Partial<ParticipantParams>): Promise<Participant> {
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

  /**
   * Request encrypted participant ID
   */
  async getEncryptedParticipantId(id: number): Promise<String> {
    // Encrypt with private key, return
    const { key, iv } = keys;

    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(`${id}`));
    cipher.finish();
    const encrypted = cipher.output;
    return `${encrypted.toHex()}`;
  }
}
