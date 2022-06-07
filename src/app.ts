import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as swaggerUI from 'swagger-ui-express';
import { RegisterRoutes } from './routes';
import { initializeDataSource } from './database/dataSource';
import { config, localLogin } from './Authentication/LocalStrategy';
import * as swaggerJson from './public/swagger.json';

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

    if (process.env.NODE_ENV === 'development') {
      app.use(['/api/openapi', '/api/docs', '/api/swagger', '/api/swagger-ui'], swaggerUI.serve, swaggerUI.setup(swaggerJson));
    }

    RegisterRoutes(app);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  });
}

export default createApp;
