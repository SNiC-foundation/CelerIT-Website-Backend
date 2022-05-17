import path from 'path';
import dotenv from 'dotenv';
import setup from './setup';

const dotEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: dotEnvPath });

setup();
