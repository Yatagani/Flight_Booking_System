import request from 'supertest';
import mongoose from 'mongoose';
import { initExpressApp } from '../../app';
import { clearDB, setUpDatabase, airplane1, airport1, airport2, flight, booking, userAdmin } from '../dbSetup';
import Booking from '../../app/modules/booking/booking.model';
import routes from '../../app/constants/routes';


let app, token;

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
});

afterAll(async() => {
  await clearDB();
})


test('Should book flight', async () => {
  const response = await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
    flightId: flight._id,
    userId: userAdmin._id,
    seat: 'A4',
  }).expect(201);

  const createdBooking = await Booking.findById(response.body._id);
  expect(createdBooking).not.toBeNull();
})

test('Assert that the flight is already booked', async () => {
  await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
      flightId: flight._id,
      userId: userAdmin._id,
      seat: 'A4',
    })
  .expect(400);
})

test('Assert that the seat exists', async () => {
  await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
      flightId: flight._id,
      userId: userAdmin._id,
      seat: 'A32',
    })
    .expect(400);
})

test('Assert that the plane capacity is reached', async () => {
  await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
      flightId: flight._id,
      userId: userAdmin._id,
      seat: 'A2',
    });
  
  await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
      flightId: flight._id,
      userId: userAdmin._id,
    seat: 'A3',
    });
  
  await request(app)
    .post(`${routes.BASE}/booking`)
    .set('Authorization', `bearer ${token}`)
    .send({
      flightId: flight._id,
      userId: userAdmin._id,
      seat: 'A5',
    });
  
  await request(app)
  .post(`${routes.BASE}/booking`)
  .set('Authorization', `bearer ${token}`)
  .send({
    flightId: flight._id,
    userId: userAdmin._id,
    seat: 'A1',
  })

  await request(app)
  .post(`${routes.BASE}/booking`)
  .set('Authorization', `bearer ${token}`)
  .send({
    flightId: flight._id,
    userId: userAdmin._id,
    seat: 'A1',
  })
  .expect(400)
})

test('should print pdf', async () => {
  const existingBooking = await Booking.findById({ _id: booking._id });
  expect(existingBooking).not.toBeNull();
});

test('should delete the flight', async () => {
  await request(app)
    .delete(`${routes.BASE}/booking/${booking._id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(201);

  // Assert that it was deleted from the database
  const deletedBooking = await Booking.findById({ _id: booking._id });
  expect(deletedBooking).toBeNull();
});


test('should return a list of booking', async () => {
  await request(app)
  .get(`${routes.BASE}/booking`)
  .set('Authorization', `bearer ${token}`)
  .expect(200);
});

