import path from 'path';
import dotenv from 'dotenv';
import { getDataSource, initializeDataSource } from '../database/dataSource';
import Ticket from '../entities/Ticket';
import BarcodeGenerator from './BarcodeGenerator';
import { barcodeDirLoc } from '../services/FileService';

dotenv.config();

initializeDataSource().then(() => {
  const repo = getDataSource().getRepository(Ticket);

  repo.find().then((tickets) => {
    tickets.forEach((t) => {
      new BarcodeGenerator(t.code, barcodeDirLoc).generateCode().then();
    });
  });
});
