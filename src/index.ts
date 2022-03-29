import express from 'express';

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.get('/test', async (request, response) => {
  response.send('Hello here');
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
