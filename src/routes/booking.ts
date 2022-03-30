import express from 'express';

const router = express.Router();

router.post('/booking', (request, response) => {
  response.status(200).send('Book a flight');
});
