import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, UploadedFile, Security,
} from 'tsoa';
import { Express } from 'express';
import PartnerService from '../services/PartnerService';
import FileService from '../services/FileService';
import Partner, { PartnerParams, QRParams } from '../entities/Partner';

/**
 * TODO: Add paramater validation
 */

@Route('partner')
@Tags('Partner')
export class PartnerController extends Controller {
  /**
   * getAllPartners() - retrieve all partners
   * TODO: Add filter options
   */
  @Get('')
  public async getAllPartners(): Promise<Partner[]> {
    return new PartnerService().getAllPartners();
  }

  /**
   * getPartner() - get single partner by id
   * @param id ID of partner to retrieve
   */
  @Get('{id}')
  public async getPartner(id: number): Promise<Partner> {
    return new PartnerService().getPartner(id);
  }

  /**
   * createPartner() - create partner
   * @param params Parameters to create partner with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createPartner(@Body() params: PartnerParams): Promise<Partner> {
    return new PartnerService().createPartner(params);
  }

  /**
   * updatePartner() - update partner
   * @param id ID of partner to update
   * @param params Update subset of parameter of partner
   */
  @Put('{id}')
  @Security('local', ['Admin'])
  public async updatePartner(id: number, @Body() params: Partial<PartnerParams>): Promise<Partner> {
    return new PartnerService().updatePartner(id, params);
  }

  /**
   * Delete partner
   * @param id ID of the partner to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deletePartner(id: number): Promise<void> {
    return new PartnerService().deletePartner(id);
  }

  /**
   * Upload a logo for a partner
   */
  @Put('{id}/logo')
  @Security('local', ['Admin'])
  public async uploadPartnerLogo(@UploadedFile() logo: Express.Multer.File, id: number) {
    await FileService.uploadPartnerLogo(logo, id);
  }

  /**
   * Request scan of an encrypted participant ID
   * @param encryptedID Encrypted participant ID of the scanned participant
   */
  @Post('{id}/scanqr')
  @Security('local', ['Partner'])
  public async requestScan(id: number, @Body() params: QRParams): Promise<void> {
    return new PartnerService().requestScan(id, params);
  }
}
