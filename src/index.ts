import express from 'express';
import Path from 'path';
import YAML from 'yamljs';
import SwaggerUI from 'swagger-ui-express';
import routes from './app/routes';
import User from './app/modules/authentication/user.model';
import './app/config/db';
import bookingRoutes from './app/routes/booking';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/v1', routes);

// Setup docs
const docsFilePath = Path.resolve(__dirname, './docs/openapi.yaml');
const jsonDocsFile = YAML.load(docsFilePath);

app.use(
  '/api/swagger',
  SwaggerUI.serve,
  SwaggerUI.setup(jsonDocsFile),
);

app.use(bookingRoutes);
app.post('/users', async (request, response) => {
  const user = new User(request.body);
  try {
    await user.save();
    response.status(201).send(user);
  } catch (e) {
    response.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
