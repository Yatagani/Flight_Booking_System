import request from 'supertest';
import { initExpressApp } from '../../app';
import Airplane from '../../app/modules/airplane/airplane.model';
import routes from '../../app/constants/routes';
import { airplane1, setUpDatabase, clearDB } from '../dbSetup';

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
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPLANE}`)
    .set('Authorization', `bearer ${token}`)
    .send(airplane)
    .expect(200);
  
  expect(response.body.name).toBe(airplane.name);
  expect(response.body.seats).toHaveLength(airplane.seats.length);
})

test('Should not create an airplane with the same name', async () => {
  const response = await request(app)
    .post(`${routes.BASE}${routes.AIRPLANE}`)
    .set('Authorization', `bearer ${token}`)
    .send({
      name: 'Airplane1',
      seats: [
        {
          seatName: 'A1',
          price: '50',
        }
      ]
    })
    .expect(422)
})

test('Should get all airplanes', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPLANE}`)
    .set('Authorization', `bearer ${token}`)
    .expect(200);

  expect(response.body).toHaveLength(2);
})

test('Should get an existing airplane', async () => {
  const response = await request(app)
    .get(`${routes.BASE}${routes.AIRPLANE}/${airplane1.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(200);
  console.log(response.body);
})

test('Should update an existing airplane', async () => {
  const response = await request(app)
    .patch(`${routes.BASE}${routes.AIRPLANE}/${airplane1._id}`)
    .set('Authorization', `bearer ${token}`)
    .send({ name: 'Airplane2' })
    .expect(200);

  expect(response.body.name).toBe('Airplane2')
})

test('Should delete an existing airplane', async () => {
  const response = await request(app)
    .delete(`${routes.BASE}${routes.AIRPLANE}/${airplane1._id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);

  const deletedAirplane = await Airplane.findById(airplane1._id);
  expect(deletedAirplane).toBe(null)
})

afterAll(async() => {
  await clearDB();
  
})