import express from 'express';
import Path from 'path';
import YAML from 'yamljs';
import SwaggerUI from 'swagger-ui-express';
import Passport from 'passport';
import { initLoggerService } from './app/config/logger';
import jwtAuth from './app/config/authentication';
import errorHandler from './app/utils/error_middleware';

import routes from './app/routes';
import initDB from './app/config/db';


export const initExpressApp = async () => {
  const app = express();
  await initDB();
  jwtAuth();
  initLoggerService();

  app.use(express.json());
  app.use(Passport.initialize());
  app.use('/api/v1', routes);

  // Setup docs
  const docsFilePath = Path.resolve(__dirname, './docs/openapi.yaml');
  const jsonDocsFile = YAML.load(docsFilePath);

  app.use(
    '/api/swagger',
    SwaggerUI.serve,
    SwaggerUI.setup(jsonDocsFile),
  );

  app.use(errorHandler);
  return app;
}

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  throw error;
});
