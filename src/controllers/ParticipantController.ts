import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put,
} from 'tsoa';
import ParticipantService from '../services/ParticipantService';
import Participant, { ParticipantParams } from '../entities/Participant';

/**
 * TODO: Add paramater validation
 */

@Route('participant')
@Tags('Participant')
export class ParticipantController extends Controller {
  /**
   * getAllParticipants() - retrieve all participants
   * TODO: Add filter options
   */
  @Get('')
  public async getAllParticipants(): Promise<Participant[]> {
    return new ParticipantService().getAllParticipants();
  }

  /**
   * getParticipant() - get single participant by id
   * @param id ID of participant to retrieve
   */
  @Get('{id}')
  public async getParticipant(id: number): Promise<Participant> {
    return new ParticipantService().getParticipant(id);
  }

  /**
   * createParticipant() - create participant
   * @param params Parameters to create participant with
   */
  @Post()
  public async createParticipant(@Body() params: ParticipantParams): Promise<Participant> {
    return new ParticipantService().createParticipant(params);
  }

  /**
   * updateParticipant() - update participant
   * @param id ID of participant to update
   * @param params Update subset of parameter of participant
   */
  @Put('{id}')
  public async updateParticipant(
    id: number,
                                 @Body() params: Partial<ParticipantParams>,
  ): Promise<Participant> {
    return new ParticipantService().updateParticipant(id, params);
  }

  /**
   * Delete participant
   * @param id ID of the participant to delete
   */
  @Delete('{id}')
  public async deleteParticipant(id: number): Promise<void> {
    return new ParticipantService().deleteParticipant(id);
  }
}
