import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put,
} from 'tsoa';
import SpeakerService from '../services/SpeakerService';
import Speaker, { SpeakerParams } from '../entities/Speaker';

/**
 * TODO: Add paramater validation
 */

@Route('speaker')
@Tags('Speaker')
export class SpeakerController extends Controller {
  /**
   * getAllSpeakers() - retrieve all speakers
   * TODO: Add filter options
   */
  @Get('')
  public async getAllSpeakers(): Promise<Speaker[]> {
    return new SpeakerService().getAllSpeakers();
  }

  /**
   * getSpeaker() - get single speaker by id
   * @param id ID of speaker to retrieve
   */
  @Get('{id}')
  public async getSpeaker(id: number): Promise<Speaker> {
    return new SpeakerService().getSpeaker(id);
  }

  /**
   * createSpeaker() - create speaker
   * @param params Parameters to create speaker with
   */
  @Post()
  public async createSpeaker(@Body() params: SpeakerParams): Promise<Speaker> {
    return new SpeakerService().createSpeaker(params);
  }

  /**
   * updateSpeaker() - update speaker
   * @param id ID of speaker to update
   * @param params Update subset of parameter of speaker
   */
  @Put('{id}')
  public async updateSpeaker(id: number, @Body() params: Partial<SpeakerParams>): Promise<Speaker> {
    return new SpeakerService().updateSpeaker(id, params);
  }

  /**
   * Delete speaker
   * @param id ID of the speaker to delete
   */
  @Delete('{id}')
  public async deleteSpeaker(id: number): Promise<void> {
    return new SpeakerService().deleteSpeaker(id);
  }
}
