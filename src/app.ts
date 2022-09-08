import express from 'express';
import bodyParser from 'body-parser';
import * as swaggerUI from 'swagger-ui-express';
import * as fs from 'fs';
import path from 'path';
import { RegisterRoutes } from './routes';
import * as swaggerJson from './public/swagger.json';
import { initializeDataSource } from './database/dataSource';
import { validationErrorHandler } from './helpers/error';
import { uploadDirLoc, uploadPartnerLogoDir, uploadSpeakerImageDir } from './services/FileService';

function createApp(): void {
  initializeDataSource().then(() => {
    const app = express();

    [uploadDirLoc, uploadPartnerLogoDir, uploadSpeakerImageDir].forEach((loc) => {
      if (!fs.existsSync(path.join(__dirname, '../', loc))) {
        fs.mkdirSync(path.join(__dirname, '../', loc));
      }
    });

    // Use body parser to read sent json payloads
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    if (process.env.NODE_ENV === 'development') {
      app.use(['/api/openapi', '/api/docs', '/api/swagger', '/api/swagger-ui'], swaggerUI.serve, swaggerUI.setup(swaggerJson));
      app.use('/api/static/partners', express.static(path.join(__dirname, '/../', uploadPartnerLogoDir)));
      app.use('/api/static/speakers', express.static(path.join(__dirname, '/../', uploadSpeakerImageDir)));
    }

    RegisterRoutes(app);
    app.use(validationErrorHandler);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`SNiC Backend listening at http://localhost:${port}`));
  });
}

export default createApp;
