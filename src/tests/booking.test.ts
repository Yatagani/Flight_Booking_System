/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import app from '../index';

const request = require('supertest');
const mongoose = require('mongoose');

const Booking = require('../app/modules/booking/booking.model');

const bookingOneId = new mongoose.Types.ObjectId();
const bookingOne = {
  _id: bookingOneId,
  flightId: '6245ac45fc7968d9b1eb0362',
  userId: '6246fa11c65e3dcb08477c9f',
  seat: 'A1',
};

beforeEach(async () => {
  await Booking.remove({});
  await new Booking(bookingOne).save();
});

test('Should book flight', async () => {
  const response = await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A4',
  }).expect(201);

  // Assert that the item was added in the database
  const booking = await Booking.findById(response.body.booking._id);
  expect(booking).not.toBeNull();

  // Assert that the flight is already booked
  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A4',
  }).expect(400);

  // Assert that the seat exists
  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A32',
  }).expect(400);

  // Assert that the plane capacity is reached
  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A2',
  });

  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A3',
  });

  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A5',
  });

  await request(app).post('/booking').send({
    flightId: '6245ac45fc7968d9b1eb0362',
    userId: '6246fa11c65e3dcb08477c9f',
    seat: 'A1',
  }).expect(400);
});

test('should delete the flight', async () => {
  await request(app).delete(`/booking/${bookingOneId}`).expect(201);

  // Assert that it was deleted from the database
  const booking = await Booking.findById({ _id: bookingOneId });
  expect(booking).toBeNull();

  // Assert that if the booking does not exists it returns a status 400
  const bookingNotExists = await Booking.findByIdAndDelete({ _id: new mongoose.Types.ObjectId() });
  expect(bookingNotExists).toBeNull();
});

test('should return a list of booking', async () => {
  await request(app).get('/booking').expect(200);
});

test('should print pdf', async () => {
  await request(app).get(`/booking/${bookingOneId}`).expect(200);
});
