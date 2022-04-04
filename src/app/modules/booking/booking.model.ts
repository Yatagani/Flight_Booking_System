import mongoose from 'mongoose';
import Flight from '../flights/flight.model';
import Airplane from '../airplane/airplane.model';
import Airport from '../airport/airport.model';
import User from '../user/user.model';

const bookingSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Flight',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  seat: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

bookingSchema.methods.getBookingObject = async function () {
  const booking = this;

  const flight = await Flight.findById(booking.flightId);
  const airplane = await Airplane.findById(flight.airplaneId);
  const flyingFrom = await Airport.findById(flight.flyingFrom);
  const flyingTo = await Airport.findById(flight.flyingTo);
  const passanger = await User.findOne({ _id: booking.userId }, { firstName: 1, lastName: 1 });
  const seatPrice = airplane.seats.find((seat) => seat.seatName === booking.seat).price;
  const totalPrice = seatPrice + flight.defaultPrice;

  const bookingObject = {
    _id: booking.id,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    flyingFrom: flyingFrom.name,
    flyingTo: flyingTo.name,
    airplaneName: airplane.name,
    price: totalPrice,
    seat: booking.seat,
    passanger: `${passanger.firstName} ${passanger.lastName}`,
  };

  return bookingObject;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
