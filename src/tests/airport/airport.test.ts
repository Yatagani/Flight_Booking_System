import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Airport from '../../app/modules/airport/airport.model';
import routes from '../../app/constants/routes';
import { airport1, setUpDatabase } from './db';

beforeAll(async () => {
  setUpDatabase();
});

test('Should create a new airport', async () => {
  await request(app)
    .post(`${routes.BASE}${routes.AIRPORTS}`)
    .send({
      name: 'Test',
      address: {
        country: 'Test',
        city: 'Test',
        street: 'Test',
        zipCode: 1000,
      },
    })
    .expect(200);

  const airport = await Airport.findOne({ name: 'Test' });
  expect(airport).not.toBe(null);
  expect(airport.address.country).toBe('Test');
});

test('Should not create a new airport with an existing name', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPORTS}`)
    .send({
      name: airport1.name,
      address: {
        country: airport1.address.country,
        city: airport1.address.city,
        street: airport1.address.street,
        zipCode: airport1.address.zipCode,
      },
    })
    .expect(400);
});

test('Should get all airports created', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPORTS}`)
    .expect(200);
  expect(response.body).toHaveLength(2);
});

test('Should get a single airport', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .expect(200);

  expect(response.body.name).toBe(airport1.name);
});

test('Should update an existing airport', async () => {
  const response = await request(app)
    .patch(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .send({ name: 'Airport2' })
    .expect(200);

  expect(response.body.name).toBe('Airport2');
});

test('Should delete an existing airport', async () => {
  const response = await request(app)
    .delete(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .expect(204);

  const deletedAirport = await Airport.findById(airport1._id);
  expect(deletedAirport).toBe(null);
});
