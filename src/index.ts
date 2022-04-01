import express from 'express';
import Path from 'path';
import YAML from 'yamljs';
import SwaggerUI from 'swagger-ui-express';
import Passport from 'passport';
import jwtAuth from './app/config/authentication';

import routes from './app/routes';
import './app/config/db';

const app = express();
const port = process.env.PORT;

// Service initializations
jwtAuth();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
