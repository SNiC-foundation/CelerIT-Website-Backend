import {
  Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags,
} from 'tsoa';
import express from 'express';
import ParticipantService from '../services/ParticipantService';
import Participant, { CreateParticipantParams, UpdateParticipantParams } from '../entities/Participant';
import User from '../entities/User';
import { ApiError, HTTPStatus } from '../helpers/error';

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
  @Security('local', ['Admin'])
  public async getAllParticipants(): Promise<Participant[]> {
    return new ParticipantService().getAllParticipants();
  }

  /**
   * getParticipant() - get single participant by id
   * @param id ID of participant to retrieve
   */
  @Get('{id}')
  @Security('local', ['Admin'])
  public async getParticipant(id: number): Promise<Participant> {
    return new ParticipantService().getParticipant(id);
  }

  /**
   * createParticipant() - create participant
   * @param params Parameters to create participant with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createParticipant(@Body() params: CreateParticipantParams): Promise<Participant> {
    return new ParticipantService().createParticipant(params);
  }

  /**
   * updateParticipant() - update participant
   * @param id ID of participant to update
   * @param params Update subset of parameter of participant
   * @param request
   */
  @Put('{id}')
  @Security('local')
  public async updateParticipant(
    id: number,
    @Body() params: Partial<UpdateParticipantParams>,
    @Request() request: express.Request,
  ): Promise<Participant> {
    const user = request.user as User;
    if (!user.roles.map((r) => r.name).includes('Admin') && user.id !== id) {
      throw new ApiError(HTTPStatus.Forbidden, 'Forbidden');
    }

    return new ParticipantService().updateParticipant(id, params);
  }

  /**
   * Delete participant
   * @param id ID of the participant to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deleteParticipant(id: number): Promise<void> {
    return new ParticipantService().deleteParticipant(id);
  }

  /**
   * Get encrypted participant id
   * @param id ID of the participant to encrypt
   */
  @Get('{id}/qrcode')
  @Security('local')
  public async getEncryptedParticipantId(id: number): Promise<string> {
    return new ParticipantService().getEncryptedParticipantId(id);
  }

  /**
   * Get all participants with their personal information for physical keycords
   */
  @Get('export/export')
  @Security('local', ['Admin'])
  public async getParticipantsExport() {
    return new ParticipantService().getParticipantExport();
  }
}
