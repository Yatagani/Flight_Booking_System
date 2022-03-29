/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import User from './models/user';
import './db/mongoose';

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.get('/test', async (request, response) => {
  response.send('Hello here');
});

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
