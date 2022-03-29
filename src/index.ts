import express from 'express';
import Path from 'path';
import YAML from 'yamljs';
import SwaggerUI from 'swagger-ui-express';
import routes from './routes';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/v1', routes);

// Setup docs
const docsFilePath = Path.resolve(__dirname, '../docs/openapi.yaml');
const jsonDocsFile = YAML.load(docsFilePath);

app.use(
  '/api/swagger',
  // basicAuth(config.apiDocsUsername, config.apiDocsPassword, true),
  SwaggerUI.serve,
  SwaggerUI.setup(jsonDocsFile),
);

app.get('/test', async (request, response) => {
  response.send('Hello here');
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
