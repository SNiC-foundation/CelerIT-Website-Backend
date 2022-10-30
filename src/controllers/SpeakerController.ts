import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, UploadedFile, Query, Security,
} from 'tsoa';
import { Express } from 'express';
import SpeakerService from '../services/SpeakerService';
import Speaker, { SpeakerParams } from '../entities/Speaker';
import FileService from '../services/FileService';

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
  public async getAllSpeakers(@Query() activities?: boolean): Promise<Speaker[]> {
    return new SpeakerService().getAllSpeakers({ returnActivities: activities });
  }

  /**
   * getSpeaker() - get single speaker by id
   * @param id ID of speaker to retrieve
   * @param activities
   */
  @Get('{id}')
  public async getSpeaker(id: number, @Query() activities?: boolean): Promise<Speaker> {
    return new SpeakerService().getSpeaker(id, { returnActivities: activities });
  }

  /**
   * createSpeaker() - create speaker
   * @param params Parameters to create speaker with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createSpeaker(@Body() params: SpeakerParams): Promise<Speaker> {
    return new SpeakerService().createSpeaker(params);
  }

  /**
   * updateSpeaker() - update speaker
   * @param id ID of speaker to update
   * @param params Update subset of parameter of speaker
   */
  @Put('{id}')
  @Security('local', ['Admin'])
  public async updateSpeaker(id: number, @Body() params: Partial<SpeakerParams>): Promise<Speaker> {
    return new SpeakerService().updateSpeaker(id, params);
  }

  /**
   * Delete speaker
   * @param id ID of the speaker to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deleteSpeaker(id: number): Promise<void> {
    return new SpeakerService().deleteSpeaker(id);
  }

  /**
   * Upload an image for a speaker
   */
  @Put('{id}/image')
  @Security('local', ['Admin'])
  public async uploadSpeakerImage(@UploadedFile() logo: Express.Multer.File, id: number) {
    await FileService.uploadSpeakerImage(logo, id);
  }
}
