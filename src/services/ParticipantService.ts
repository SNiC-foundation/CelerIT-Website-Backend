import { Repository } from 'typeorm';
import * as forge from 'node-forge';
import Participant, { CreateParticipantParams, UpdateParticipantParams } from '../entities/Participant';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';
import keys from '../qrcodes/keys.json';

export interface ParticipantExport {
  id: number;
  ticket: string;
  name: string;
  studyAssociation: string;
  studyProgram: string;
  qrCode: string;
  track1Name: string;
  track1Location: string;
  track2Name: string;
  track2Location: string;
  track3Name: string;
  track3Location: string;
}

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
  async updateParticipant(
    id: number,
    params: Partial<UpdateParticipantParams>,
  ): Promise<Participant> {
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
  getEncryptedParticipantId(id: number): string {
    // Encrypt with private key, return
    const { key, iv } = keys;

    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(`${id}`));
    cipher.finish();
    const encrypted = cipher.output;
    return `${encrypted.toHex()}`;
  }

  public async getParticipantExport(): Promise<ParticipantExport[]> {
    const participants = await this.repo.find({
      relations: {
        user: {
          subscriptions: {
            activity: {
              programPart: true,
            },
          },
          ticket: true,
        },
      },
    });

    return participants.map((p) => {
      const subscriptions = p.user.subscriptions
        .sort((a, b) => a.activity.programPart.id - b.activity.programPart.id);

      return {
        id: p.id,
        ticket: p.user.ticket?.code ?? '',
        name: p.user.name,
        studyAssociation: p.user.ticket?.association ?? '',
        studyProgram: p.studyProgram,
        qrCode: this.getEncryptedParticipantId(p.id),
        track1Name: subscriptions[0] ? subscriptions[0].activity.name : '',
        track1Location: subscriptions[0] ? subscriptions[0].activity.location : '',
        track2Name: subscriptions[1] ? subscriptions[1].activity.name : '',
        track2Location: subscriptions[1] ? subscriptions[1].activity.location : '',
        track3Name: subscriptions[2] ? subscriptions[2].activity.name : '',
        track3Location: subscriptions[2] ? subscriptions[2].activity.location : '',
      };
    });
  }
}
