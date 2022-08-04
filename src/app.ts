import express, { Express } from 'express';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as swaggerUI from 'swagger-ui-express';
import { RegisterRoutes } from './routes';
import { getDataSource, initializeDataSource } from './database/dataSource';
import { config, localLogin } from './authentication/LocalStrategy';
import * as swaggerJson from './public/swagger.json';
import { Session } from './entities/Authentication/Session';

/**
 * Setup session support.
 * @param app
 */
export function setupSessionSupport(app: Express) {
  const sessionRepo = getDataSource().getRepository(Session);

  // Setup session config
  const sess = {
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
      ttl: 84600,
    }).connect(sessionRepo),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { },
  } as session.SessionOptions;

  if (process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true') {
    sess.cookie!.secure = true; // serve secure cookies
  }

  app.set('trust proxy', 2);
  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  // Initialize passport config.
  config();
}

function createApp(): void {
  initializeDataSource().then(() => {
    const app = express();

    // Use body parser to read sent json payloads
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    setupSessionSupport(app);
    app.post('/api/login', localLogin);

    if (process.env.NODE_ENV === 'development') {
      app.use(['/api/openapi', '/api/docs', '/api/swagger', '/api/swagger-ui'], swaggerUI.serve, swaggerUI.setup(swaggerJson));
    }

    RegisterRoutes(app);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  });
}

export default createApp;
