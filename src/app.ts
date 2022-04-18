import express from 'express';
import bodyParser from 'body-parser';
import * as swaggerUI from 'swagger-ui-express';
import { RegisterRoutes } from './routes';
import * as swaggerJson from './public/swagger.json';
import AppDataSource from './database/dataSource';

function createApp(): void {
  AppDataSource.initialize().then(() => {
    const app = express();

    // Use body parser to read sent json payloads
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    if (process.env.NODE_ENV === 'development') {
      app.use(['/api/openapi', '/api/docs', '/api/swagger', '/api/swagger-ui'], swaggerUI.serve, swaggerUI.setup(swaggerJson));
    }

    RegisterRoutes(app);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  });
}

export default createApp;
