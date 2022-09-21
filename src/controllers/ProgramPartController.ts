import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, Security,
} from 'tsoa';
import ProgramPartService from '../services/ProgramPartService';
import ProgramPart, { ProgramPartParams } from '../entities/ProgramPart';

/**
 * TODO: Add paramater validation
 */

@Route('programpart')
@Tags('ProgramPart')
export class ProgramPartController extends Controller {
  /**
   * getAllProgramParts() - retrieve all programParts
   * TODO: Add filter options
   */
  @Get('')
  public async getAllProgramParts(): Promise<ProgramPart[]> {
    return new ProgramPartService().getAllProgramParts();
  }

  /**
   * getProgramPart() - get single programPart by id
   * @param id ID of programPart to retrieve
   */
  @Get('{id}')
  public async getProgramPart(id: number): Promise<ProgramPart> {
    return new ProgramPartService().getProgramPart(id);
  }

  /**
   * createProgramPart() - create programPart
   * @param params Parameters to create programPart with
   */
  @Post()
  @Security('local')
  public async createProgramPart(@Body() params: ProgramPartParams): Promise<ProgramPart> {
    return new ProgramPartService().createProgramPart(params);
  }

  /**
   * updateProgramPart() - update programPart
   * @param id ID of programPart to update
   * @param params Update subset of parameter of programPart
   */
  @Put('{id}')
  @Security('local')
  public async updateProgramPart(id: number, @Body() params: Partial<ProgramPartParams>):
      Promise<ProgramPart> {
    return new ProgramPartService().updateProgramPart(id, params);
  }

  /**
   * Delete programPart
   * @param id ID of the programPart to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deleteProgramPart(id: number): Promise<void> {
    return new ProgramPartService().deleteProgramPart(id);
  }
}
