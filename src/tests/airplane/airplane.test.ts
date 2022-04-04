import request from 'supertest';
import app from '../../app';
import Airplane from '../../app/modules/airplane/airplane.model';
import routes from '../../app/constants/routes';
import { airplane1, setUpDatabase } from './db';

beforeAll(async () => {
  setUpDatabase();
  const response = await request(app)
    .post(`${routes.BASE}/auth/login`)
    .send({
      "email": "jataganiklejdi@gmail.com",
      "password": "Test1234"
    })
  console.log(response);
})

const airplane = {
  name: 'Test',
  seats: [
    {
      seatName: 'Test1',
      price: 50
    },
    {
      seatName: 'Test2',
      price: 40
    },
    {
      seatName: 'Test3',
      price: 30
    },
  ]
}

test('Should create a new airplane', async () => {
  const response1 = await request(app)
    .post(`${routes.BASE}/auth/login`)
    .send({
      "email": "jataganiklejdi@gmail.com",
      "password": "Test1234"
    })
  console.log(response1.body);
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPLANE}`)
    .send(airplane)
    .expect(200);
  
  expect(response.body.name).toBe(airplane.name);
  expect(response.body.seats).toHaveLength(airplane.seats.length);
})

test('Should not create an airplane with the same name', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPLANE}`)
    .send({
      name: 'Airplane1',
      seats: [
        {
          seatName: 'A1',
          price: '50',
        }
      ]
    })
    .expect(400)
})

test('Should get all airplanes', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPLANE}`)
    .expect(200);

  expect(response.body).toHaveLength(2);
})

test('Should get an existing airplane', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPLANE}/${airplane1._id}`)
    .expect(200);

  expect(response.body.name).toBe(airplane1.name);
})

test('Should update an existing airplane', async () => {
  const response = await request(app)
    .patch(`${routes.BASE}${routes.AIRPLANE}/${airplane1._id}`)
    .send({ name: 'Airplane2' })
    .expect(200);

  expect(response.body.name).toBe('Airplane2')
})

test('Should delete an existing airplane', async () => {
  const response = await request(app)
    .delete(`${routes.BASE}${routes.AIRPLANE}/${airplane1._id}`)
    .expect(204);

  const deletedAirplane = await Airplane.findById(airplane1._id);
  expect(deletedAirplane).toBe(null)
})