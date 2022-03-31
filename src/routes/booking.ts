import express from 'express';
import Booking from '../app/modules/booking/booking.model';

const router = express.Router();

router.post('/booking', async (request, response) => {
  // Check if the flight is already booked
  const bookingExists = await Booking.findOne({ flightId: request.body.flightId });
  if (bookingExists) return response.status(400).send({ error: 'Flight already booked' });

  // Check if the plan capacity is reached
  // get plane capacity
  // get all bookings with that plane
  // compare numbers
  const booking = new Booking(request.body);

  try {
    booking.save();
    return response.status(201).send(booking);
  } catch (e) {
    return response.status(500).send(e);
  }
});

router.get('/booking', async (request, response) => {
  const bookingList = await Booking.find({});

  try {
    response.status(200).send(bookingList);
  } catch (e) {
    response.status(500).send();
  }
});

router.get('/booking/:id', async (request, response) => {
  try {
    const bookingTicket = await Booking.findById({ _id: request.params.id });

    if (!bookingTicket) return response.status(400).send();

    return response.status(200).send();
  } catch (e) {
    return response.status(500).send();
  }
});

router.delete('/booking/:id', async (request, response) => {
  try {
    const booking = await Booking.findByIdAndDelete({ _id: request.params.id });

    if (!booking) {
      response.status(400).send();
    }

    response.status(200).send();
  } catch (e) {
    response.status(500);
  }

  response.status(200).send();
});

export default router;
