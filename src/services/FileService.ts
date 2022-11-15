import * as fs from 'fs';
import express, { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mime from 'mime';
import archiver from 'archiver';
import { ApiError, HTTPStatus } from '../helpers/error';
import PartnerService from './PartnerService';
import SpeakerService from './SpeakerService';
import QrCodeGenerator from '../qrcodes/QrCodeGenerator';
import { getDataSource } from '../database/dataSource';
import Participant from '../entities/Participant';
// eslint-disable-next-line import/no-cycle
import ParticipantService from './ParticipantService';

export const uploadDirLoc = 'data';
export const uploadPartnerLogoDir = 'data/partners';
export const uploadSpeakerImageDir = 'data/speakers';
export const barcodeDirLoc = 'data/barcodes';
export const qrCodeDirLoc = 'data/qrcodes';

export default class FileService {
  private static removeFileAtLoc(location: string) {
    try {
      fs.unlinkSync(location);
    } catch (e) {
      console.error(`File ${location} does not exist, so could not be removed`);
    }
  }

  static async uploadPartnerLogo(file: Express.Multer.File, companyId: number) {
    const partner = await new PartnerService().getPartner(companyId);

    if (!file) {
      throw new ApiError(HTTPStatus.BadRequest, 'No file is passed in the request');
    }

    const fileExtension = mime.getExtension(file.mimetype) || '';
    if (!['jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp', 'svg'].includes(fileExtension)) {
      throw new ApiError(HTTPStatus.BadRequest, 'Partner logo needs to be an image file');
    }

    if (partner.logoFilename != null && partner.logoFilename !== '') {
      this.removeFileAtLoc(path.join(__dirname, '/../../', uploadDirLoc, partner.logoFilename));
    }

    const randomFileName = `${uuidv4()}.${fileExtension}`;
    const relativeLocation = path.join(uploadPartnerLogoDir.substring(5), randomFileName);
    const fileLocation = path.join(__dirname, '/../../', uploadPartnerLogoDir, randomFileName);
    partner.logoFilename = relativeLocation;
    fs.writeFileSync(fileLocation, file.buffer);
    try {
      await partner.save();
    } catch (err: any) {
      this.removeFileAtLoc(fileLocation);
      throw new Error(err);
    }
  }

  static async uploadSpeakerImage(file: Express.Multer.File, speakerId: number) {
    const speaker = await new SpeakerService().getSpeaker(speakerId);

    if (!file) {
      throw new ApiError(HTTPStatus.BadRequest, 'No file is passed in the request');
    }

    const fileExtension = mime.getExtension(file.mimetype) || '';
    if (!['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(fileExtension)) {
      throw new ApiError(HTTPStatus.BadRequest, 'Speaker image needs to be an image file');
    }

    if (speaker.imageFilename != null && speaker.imageFilename !== '') {
      this.removeFileAtLoc(path.join(__dirname, '/../../', uploadDirLoc, speaker.imageFilename));
    }

    const randomFileName = `${uuidv4()}.${fileExtension}`;
    const relativeLocation = path.join(uploadPartnerLogoDir.substring(5), randomFileName);
    const fileLocation = path.join(__dirname, '/../../', uploadPartnerLogoDir, randomFileName);
    speaker.imageFilename = relativeLocation;
    fs.writeFileSync(fileLocation, file.buffer);
    try {
      await speaker.save();
    } catch (err: any) {
      this.removeFileAtLoc(fileLocation);
      throw new Error(err);
    }
  }

  public static async getParticipantQrCodeExport(res: express.Response): Promise<void> {
    const participants = await getDataSource().getRepository(Participant).find();

    const dir = path.join(__dirname, '../../', qrCodeDirLoc);
    const participantService = new ParticipantService();

    await Promise.all(participants.map((p) => {
      const code = participantService.getEncryptedParticipantId(p.id);
      return new QrCodeGenerator(code, dir).generateCode();
    }));

    const archive = archiver('zip');

    return new Promise((resolve, reject) => {
      archive.on('error', (err) => {
        reject(err);
      });

      res.on('finish', () => {
        res.end();
        resolve();
      });

      archive.directory(dir, false);
      archive.pipe(res);
      archive.finalize();
    });
  }
}
