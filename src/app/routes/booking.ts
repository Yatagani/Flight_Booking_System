import express from 'express';
import Airplane from '../modules/airplane/airplane.model';
import Airport from '../modules/airport/airport.model';
import User from '../modules/authentication/user.model';
import Booking from '../modules/booking/booking.model';
import Flight from '../modules/flights/flight.model';
import generatePdf from '../utils';

const router = express.Router();

router.post('/booking', async (request, response) => {
  // Check if the plan capacity is reached
  const planeSeats = await Flight.findById(request.body.flightId)
    .populate('airplaneId', 'name seats', Airplane).exec()
    .then((res) => res.airplaneId.seats);

  const bookedFlights = await Booking.find({ flightId: request.body.flightId });
  if (planeSeats.length === bookedFlights.length) return response.status(400).send({ error: 'There are no empty seats for this flight' });

  // Check if the provided seat exists
  const seatExists = planeSeats.find((seat) => seat.seatName === request.body.seat);
  if (!seatExists) return response.status(400).send({ error: `There is no seat with id ${request.body.seat}` });

  // Check if the flight is already booked
  const isSeatTaken = await Booking.findOne(
    {
      flightId: request.body.flightId,
      seat: request.body.seat,
    },
  );
  if (isSeatTaken) return response.status(400).send({ error: 'Seat is taken' });

  const booking = new Booking(request.body);

  try {
    booking.save();
    return response.status(201).send(await booking.getBookingObject());
  } catch (e) {
    return response.status(500).send(e);
  }
});

router.get('/booking', async (request, response) => {
  const bookingList = await Booking.find({});
  const bookingListModified = await Promise.all(
    bookingList.map((bookingItem) => bookingItem.getBookingObject()),
  );

  try {
    response.status(200).send(bookingListModified);
  } catch (e) {
    response.status(500).send();
  }
});

router.delete('/booking/:id', async (request, response) => {
  try {
    const booking = await Booking.findByIdAndDelete({ _id: request.params.id });

    if (!booking) {
      response.status(400).send();
    }

    response.status(201).send(await booking.getBookingObject());
  } catch (e) {
    response.status(500);
  }

  response.status(200).send();
});

router.get('/booking/:id', async (request, response) => {
  try {
    const booking = await Booking.findById({ _id: request.params.id });
    const bookingExpandedFlight = await Flight.findById(booking.flightId)
      .populate('flyingFrom flyingTo', 'name', Airport)
      .populate('airplaneId', 'name seats', Airplane);

    const passanger = await User.findById(booking.userId);

    const seatPrice = await bookingExpandedFlight.airplaneId.seats.find(
      (seat) => seat.seatName === booking.seat,
    ).price;
    const totalPrice = seatPrice + bookingExpandedFlight.defaultPrice;

    const docDefinition = {
      content: [
        {
          table: {
            widths: ['*'],
            body: [
              [{
                text: 'Boarding pass', fillColor: '#56BBF1', fontSize: 14, bold: true, alignment: 'center', color: 'white', margin: [0, 0, 0, 0],
              }],
            ],
          },
          layout: 'noBorders',
        },
        { text: '', margin: [0, 0, 0, 20] },
        {
          table: {
            widths: [180, 180, '*'],
            heights: [0, 30, 0, 30, 0, 30, 0, 30],
            body: [
              [{ text: 'Passanger name', fontSize: 12, color: 'grey' }, {}, {}],
              [`${passanger.firstName} ${passanger.lastName}`, '', ''],
              [{ text: 'From', fontSize: 12, color: 'grey' }, { text: 'Carrier', fontSize: 12, color: 'grey' }, {}],
              [`${bookingExpandedFlight.flyingFrom.name}`, 'SOFTUP AIRLINE', ''],
              [{ text: 'To', fontSize: 12, color: 'grey' }, { text: 'Date', fontSize: 12, color: 'grey' }, { text: 'Time', fontSize: 12, color: 'grey' }],
              [`${bookingExpandedFlight.flyingTo.name}`, '09JUN', `${bookingExpandedFlight.departureTime}`],
              [{ text: 'Flight', fontSize: 12, color: 'grey' }, { text: 'Seat', fontSize: 12, color: 'grey' }, {}],
              [{ text: `FL${booking.flightId.valueOf().slice(0, 3)}`, bold: true }, { text: `${booking.seat}`, bold: true }, {}],
            ],
          },
          layout: 'noBorders',
        },
        {
          text: `Price $${totalPrice}`, alignment: 'right', fontSize: 15, margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: ['*', 100],
            body: [
              [{ text: '', fit: [40, 40], fillColor: '#56BBF1' }, {
                text: '', fillColor: '#56BBF1', fontSize: 14, bold: true, alignment: 'center', color: 'white', margin: [0, 0, 0, 10],
              }],
            ],
          },
          layout: 'noBorders',
        },
      ],
    };

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-disposition', 'attachment; filename=ticket.pdf');
    response.send(await generatePdf(docDefinition));
  } catch (e) {
    response.status(500).send(e);
  }
});

export default router;
