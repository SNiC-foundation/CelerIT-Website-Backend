import {
  Controller, Get, Post, Route, Body, Tags, Put,
} from 'tsoa';
import express from 'express';
import SpeakerService from '../services/SpeakerService';
import Speaker, { SpeakerParams } from '../entities/Speaker';

/**
 * TODO: Add paramater validation
 */

@Route('Speaker')
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
   * @param req Express.js request object
   */
  @Post()
  public async createSpeaker(@Body() params: SpeakerParams): Promise<Speaker> {
    return new SpeakerService().createSpeaker(params);
  }

  /**
   * updateSpeaker() - update speaker
   * @param id ID of speaker to update
   * @param params Update subset of parameter of speaker
   * @param req Express.js request object
   */
  @Put('{id}')
  public async updateSpeaker(id: number, @Body() params: Partial<SpeakerParams>): Promise<Speaker> {
    return new SpeakerService().updateSpeaker(id, params);
  }
}
