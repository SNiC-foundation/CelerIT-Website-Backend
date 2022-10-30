import * as fs from 'fs';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mime from 'mime';
import { ApiError, HTTPStatus } from '../helpers/error';
import PartnerService from './PartnerService';
import SpeakerService from './SpeakerService';

export const uploadDirLoc = 'data';
export const uploadPartnerLogoDir = 'data/partners';
export const uploadSpeakerImageDir = 'data/speakers';
export const barcodeDirLoc = 'data/barcodes';

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
}
