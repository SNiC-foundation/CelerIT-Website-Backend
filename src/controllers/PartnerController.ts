import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, UploadedFile, Security,
} from 'tsoa';
import { Express } from 'express';
import PartnerService from '../services/PartnerService';
import Partner, { PartnerParams } from '../entities/Partner';
import FileService from '../services/FileService';

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
  @Security('local')
  public async createPartner(@Body() params: PartnerParams): Promise<Partner> {
    return new PartnerService().createPartner(params);
  }

  /**
   * updatePartner() - update partner
   * @param id ID of partner to update
   * @param params Update subset of parameter of partner
   */
  @Put('{id}')
  @Security('local')
  public async updatePartner(id: number, @Body() params: Partial<PartnerParams>): Promise<Partner> {
    return new PartnerService().updatePartner(id, params);
  }

  /**
   * Delete partner
   * @param id ID of the partner to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deletePartner(id: number): Promise<void> {
    return new PartnerService().deletePartner(id);
  }

  /**
   * Upload a logo for a partner
   */
  @Put('{id}/logo')
  @Security('local')
  public async uploadPartnerLogo(@UploadedFile() logo: Express.Multer.File, id: number) {
    await FileService.uploadPartnerLogo(logo, id);
  }
}
