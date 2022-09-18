import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, Security,
} from 'tsoa';
import ParticipantService from '../services/ParticipantService';
import Participant, { CreateParticipantParams, UpdateParticipantParams } from '../entities/Participant';

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
  @Security('local')
  public async getAllParticipants(): Promise<Participant[]> {
    return new ParticipantService().getAllParticipants();
  }

  /**
   * getParticipant() - get single participant by id
   * @param id ID of participant to retrieve
   */
  @Get('{id}')
  @Security('local')
  public async getParticipant(id: number): Promise<Participant> {
    return new ParticipantService().getParticipant(id);
  }

  /**
   * createParticipant() - create participant
   * @param params Parameters to create participant with
   */
  @Post()
  @Security('local')
  public async createParticipant(@Body() params: CreateParticipantParams): Promise<Participant> {
    return new ParticipantService().createParticipant(params);
  }

  /**
   * updateParticipant() - update participant
   * @param id ID of participant to update
   * @param params Update subset of parameter of participant
   */
  @Put('{id}')
  @Security('local')
  public async updateParticipant(
    id: number,
                                 @Body() params: Partial<UpdateParticipantParams>,
  ): Promise<Participant> {
    return new ParticipantService().updateParticipant(id, params);
  }

  /**
   * Delete participant
   * @param id ID of the participant to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deleteParticipant(id: number): Promise<void> {
    return new ParticipantService().deleteParticipant(id);
  }
}
