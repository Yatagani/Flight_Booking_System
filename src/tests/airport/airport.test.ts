import request from 'supertest';
import { initExpressApp } from '../../app';
import Airport from '../../app/modules/airport/airport.model';
import routes from '../../app/constants/routes';
import { airport1, setUpDatabase, clearDB } from '../dbSetup';

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
    console.log(loggedInUser.body);
    
  token = loggedInUser.body.token;
})

afterAll(async() => {
  await clearDB();
})


test('Should create a new airport', async () => {
  await request(app)
    .post(`${routes.BASE}${routes.AIRPORTS}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Test',
        address: {
            country: 'Test',
            city: 'Test',
            street: 'Test',
            zipCode: 1000,
          }
        })
    .expect(200);

    const airport = await Airport.findOne({name: 'Test'})
    expect(airport).not.toBe(null);
})

test('Should not create a new airport with an existing name', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPORTS}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: airport1.name,
      address: {
        country: airport1.address.country,
        city: airport1.address.city,
        street: airport1.address.street,
        zipCode: airport1.address.zipCode,
      }
    })
    .expect(500)
})

test('Should get all airports created', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPORTS}`)
    .set('Authorization', `bearer ${token}`)
    .expect(200)
  expect(response.body).toHaveLength(3);
});

test('Should get a single airport', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(200);

  expect(response.body.name).toBe(airport1.name)
})

test('Should update an existing airport', async () => {
  const response = await request(app)
    .patch(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .set('Authorization', `bearer ${token}`)
    .send({ name: 'Airport3' })
    .expect(200);

  expect(response.body.name).toBe('Airport3')
})

test('Should delete an existing airport', async () => {
  const response = await request(app)
    .delete(`${routes.BASE}${routes.AIRPORTS}/${airport1._id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);

  const deletedAirport = await Airport.findById(airport1._id);
  expect(deletedAirport).toBe(null)
})