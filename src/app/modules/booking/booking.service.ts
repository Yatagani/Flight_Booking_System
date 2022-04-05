import * as dal from './booking.dal';
import Booking from './booking.model';
import Flight from '../flight/flight.model';
import User from '../user/user.model';
import Airplane from '../airplane/airplane.model';
import Airport from '../airport/airport.model';
import { authorizeRequest } from '../user/user.authorize';
import { BadRequest, UnprocessableEntity } from '../../utils/error';

export const createBooking = async ({ requestBody }) => {
  const providedKeys = Object.keys(requestBody);
  const allowedKeys = ['flightId', 'userId', 'seat'];
  const isValidInput = providedKeys.every((key) => allowedKeys.includes(key));

  if (!isValidInput) throw new BadRequest('Invalid field');

  const planeSeats = await Flight.findById(requestBody.flightId)
    .populate('airplaneId', 'name seats', Airplane).exec()
    .then((res) => res.airplaneId.seats);

  const bookedFlights = await Booking.find({ flightId: requestBody.flightId });
  if (planeSeats.length === bookedFlights.length) throw new UnprocessableEntity('There are no empty seats for this flight');

  // Check if the provided seat exists
  const seatExists = planeSeats.find((seat) => seat.seatName === requestBody.seat);
  if (!seatExists) throw new UnprocessableEntity(`There is no seat with id ${requestBody.seat}`);

  // Check if the flight is already booked
  const isSeatTaken = await Booking.findOne(
    {
      flightId: requestBody.flightId,
      seat: requestBody.seat,
    },
  );
  if (isSeatTaken) throw new UnprocessableEntity('Seat is taken');

  const data = new Booking(requestBody);
  const createdBooking = await dal.createBooking({ data });
  return createdBooking.getBookingObject();
};

export const deleteBooking = async ({ id }) => {
  const booking = await dal.deleteBooking({ id });

  if (!booking) throw new UnprocessableEntity(`There is not booking with id ${id}`);

  return booking.getBookingObject();
};

export const getBooking = async ({ id }) => {
  const booking = await dal.readBooking({ id });

  if (!booking) throw new UnprocessableEntity(`There is no booking with id ${id}`);

  const bookingExpandedFlight = await Flight.findById(booking.flightId)
    .populate('flyingFrom flyingTo', 'name', Airport)
    .populate('airplaneId', 'name seats', Airplane);

  const passanger = await User.findById(booking.userId);

  const seatPrice = await bookingExpandedFlight.airplaneId.seats.find(
    (seat) => seat.seatName === booking.seat,
  ).price;
  const totalPrice = seatPrice + bookingExpandedFlight.defaultPrice;

  const bookingObject = {
    passangerFullName: `${passanger.firstName} ${passanger.lastName}`,
    flyingFrom: bookingExpandedFlight.flyingFrom.name,
    flyingTo: bookingExpandedFlight.flyingTo.name,
    departureTime: bookingExpandedFlight.departureTime,
    flightId: `FL${booking.flightId.valueOf().slice(0, 3)}`,
    seat: booking.seat,
    price: `Price $${totalPrice}`,
  };

  const docDefinition = {
    content: [
      {
        table: {
          widths: ['*'],
          body: [
            [{
              text: 'Boarding pass',
              fillColor: '#56BBF1',
              fontSize: 14,
              bold: true,
              alignment: 'center',
              color: 'white',
              margin: [0, 0, 0, 0],
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
            [bookingObject.passangerFullName, '', ''],
            [{ text: 'From', fontSize: 12, color: 'grey' },
              { text: 'Carrier', fontSize: 12, color: 'grey' },
              {}],
            [bookingObject.flyingFrom, 'SOFTUP AIRLINE', ''],
            [{ text: 'To', fontSize: 12, color: 'grey' },
              { text: 'Date', fontSize: 12, color: 'grey' },
              { text: 'Time', fontSize: 12, color: 'grey' }],
            [bookingObject.flyingTo, '09JUN', bookingObject.departureTime],
            [{ text: 'Flight', fontSize: 12, color: 'grey' },
              { text: 'Seat', fontSize: 12, color: 'grey' },
              {}],
            [{ text: bookingObject.flightId, bold: true },
              { text: bookingObject.seat, bold: true }, {}],
          ],
        },
        layout: 'noBorders',
      },
      {
        text: bookingObject.price, alignment: 'right', fontSize: 15, margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ['*', 100],
          body: [
            [{ text: '', fit: [40, 40], fillColor: '#56BBF1' }, {
              text: '',
              fillColor: '#56BBF1',
              fontSize: 14,
              bold: true,
              alignment: 'center',
              color: 'white',
              margin: [0, 0, 0, 10],
            }],
          ],
        },
        layout: 'noBorders',
      },
    ],
  };

  return docDefinition;
};

export const getBookingsList = async ({ user, limit, skip }) => {
  authorizeRequest({ user });
  const bookingsList = await dal.listBooking(limit, skip);

  const bookingListModified = await Promise.all(
    bookingsList.map((bookingItem) => bookingItem.getBookingObject()),
  );

  return bookingListModified;
};
