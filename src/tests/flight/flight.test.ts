import request from 'supertest';
import { initExpressApp } from '../../app';
import routes from '../../app/constants/routes';
import { airplane1, airport1, airport2, flight, setUpDatabase, clearDB } from '../dbSetup';
import Flight from '../../app/modules/flight/flight.model';

let token: string;
let app;

beforeAll(async () => {
  app = await initExpressApp();
  await clearDB();
  await setUpDatabase();

  const loggedInUser = await request(app)
    .post(`${routes.BASE}/auth/login`)
    .send({
      email: "user.admin@test.com",
      password: "Test1234"
    })
    
  token = loggedInUser.body.token;
})

afterAll(async() => {
  await clearDB();
})

const validFlight = {
  departureTime: '11:00',
  arrivalTime: '12:00',
  flyingFrom: airport1._id,
  flyingTo: airport2._id,
  airplaneId: airplane1._id,
  defaultPrice: 1000,
}
const flightWithMissingData = {
  departureTime: '11:00',
  arrivalTime: '12:00',
  flyingFrom: airport1._id,
  defaultPrice: 1000,
}
const flightWithInvalidData = {
  departureTime: '11:00',
  arrivalTime: '12:00',
  flyingFrom: '6247122cbeab9a0037cffb55',
  flyingTo: airport2._id,
  airplaneId: airplane1._id,
  defaultPrice: 1000,
}

test('Should create a new flight', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.FLIGHT}`)
    .set('Authorization', `bearer ${token}`)
    .send(validFlight)
    .expect(200);
})

test('Should not create a flight if missing data', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.FLIGHT}`)
    .set('Authorization', `bearer ${token}`)
    .send(flightWithMissingData)
    .expect(400)
})

test('Should not create a flight if the airplane id does not exist in the db', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.FLIGHT}`)
    .set('Authorization', `bearer ${token}`)
    .send(flightWithInvalidData)
    .expect(404)
})

test('Should get all flights', async () => {
  const response = await request(app)
  .get(`${routes.BASE}${routes.FLIGHT}`)
  .set('Authorization', `bearer ${token}`)
  .expect(200);

  expect(response.body).toHaveLength(2);
})

test('Should get an existing flight', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.FLIGHT}/${flight.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(200);
})

test('Should not update if there are missing data', async () => {
  const response = await request(app)
  .patch(`${routes.BASE}${routes.FLIGHT}/${flight._id}`)
  .set('Authorization', `bearer ${token}`)
  .send({ })
  .expect(400);
})

test('Should update an existing airplane', async () => {
  const response = await request(app)
    .patch(`${routes.BASE}${routes.FLIGHT}/${flight._id}`)
    .set('Authorization', `bearer ${token}`)
    .send({ departureTime: '11:30' })
    .expect(200);

  expect(response.body.departureTime).toBe('11:30')
})

test('Should delete an existing flight', async () => {
  const response = await request(app)
    .delete(`${routes.BASE}${routes.FLIGHT}/${flight._id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);

  const deletedFlight = await Flight.findById(flight._id);
  expect(deletedFlight).toBe(null)
})