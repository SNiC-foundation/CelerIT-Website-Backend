import dotenv from 'dotenv';
import path from 'path';
import createApp from './app';

const dotEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: dotEnvPath });

createApp();
