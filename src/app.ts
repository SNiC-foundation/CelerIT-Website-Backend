import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import bodyParser from 'body-parser';
import * as swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import { RegisterRoutes } from './routes';
import * as swaggerJson from './public/swagger.json';
import AppDataSource from './database/dataSource';
import { config, localLogin } from './Authentication/LocalStrategy';
import { initializeDataSource } from './database/dataSource';

function createApp(): void {
  initializeDataSource().then(() => {
    const app = express();
    const sessionStore = new session.MemoryStore();

    // Use body parser to read sent json payloads
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser('secret'));
    app.use(session({
      cookie: { maxAge: 60000 },
      store: sessionStore,
      saveUninitialized: true,
      resave: true,
      secret: 'secret',
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    config();
    app.post('/api/login', localLogin);

    RegisterRoutes(app);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  });
}

export default createApp;
