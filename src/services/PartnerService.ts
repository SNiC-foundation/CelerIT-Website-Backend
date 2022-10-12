import { Repository } from 'typeorm';
import * as forge from 'node-forge';
import Partner, { PartnerParams, QRParams } from '../entities/Partner';
import Participant from '../entities/Participant';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';
import keys from '../qrcodes/keys.json';

export default class PartnerService {
  repo: Repository<Partner>;

  constructor(repo?: Repository<Partner>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Partner);
  }

  /**
   * Get all Partners
   */
  public async getAllPartners(): Promise<Partner[]> {
    return this.repo.find();
  }

  /**
   * Get one Partner
   * TODO: Add relations in findOne()
   */
  async getPartner(id: number): Promise<Partner> {
    const partner = await this.repo.findOne({ where: { id } });
    if (partner == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Partner not found');
    }
    return partner;
  }

  /**
   * Create Partner
   */
  createPartner(params: PartnerParams): Promise<Partner> {
    const partner = {
      ...params,
    } as any as Partner;
    return this.repo.save(partner);
  }

  /**
   * Update Partner
   */
  async updatePartner(id: number, params: Partial<PartnerParams>): Promise<Partner> {
    await this.repo.update(id, params);
    const partner = await this.getPartner(id);

    if (partner == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return partner;
  }

  /**
   * Delete Partner
   * TODO: Add relations in findOne()
   */
  async deletePartner(id: number): Promise<void> {
    const partner = await this.repo.findOne({ where: { id } });

    if (partner == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Partner not found');
    }

    await this.repo.delete(partner.id);
  }

  /**
   * QR Code Scanned
   */
  async requestScan(id: number, params: QRParams): Promise<void> {
    const { key, iv } = keys;

    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(params.encryptedId)));
    decipher.finish(); // check 'result' for true/false

    const participantId = parseInt(decipher.output.toString(), 10);
    const participant = await getDataSource().getRepository(Participant).findOne(
      { where: { id: participantId } },
    );
    if (participant == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Participant not found');
    } else {
      await this.logScan(id, participant);
    }

    console.log(`id: ${decipher.output.toString()}`);
  }

  /**
   * Log participant scan to database
   */
  async logScan(partnerId: number, participant: Participant): Promise<void> {
    // Check if participant_id agrees
    // Store in scan table

    if (participant.agreeToSharingWithCompanies) {
      const partner = await this.getPartner(partnerId);

      partner.participants.push(participant);
      await partner.save();
    }
  }
}
