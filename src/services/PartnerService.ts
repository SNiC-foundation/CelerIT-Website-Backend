import { Repository } from 'typeorm';
import Partner, { PartnerParams } from '../entities/Partner';
import AppDataSource from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class PartnerService {
  repo: Repository<Partner>;

  constructor(repo?: Repository<Partner>) {
    this.repo = repo !== undefined ? repo : AppDataSource.getRepository(Partner);
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
}
