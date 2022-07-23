import { Repository } from 'typeorm';
import Partner, { PartnerParams, QRParams } from '../entities/Partner';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

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
  async requestScan(id: number, params: Partial<QRParams>): Promise<void> {
    // Decrypt string, return 204 if participant exists
    // return 400 if bad request
  }

  /**
   * Log participant scan to database
   */
  async logScan(id: number): Promise<void> {
    // Check if participant_id agrees
    // Store in scan table
  }
}
