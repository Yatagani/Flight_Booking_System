import mongoose from 'mongoose';
import Booking from '../../app/modules/booking/booking.model';

const bookingOneId = new mongoose.Types.ObjectId();
const bookingOne = {
  _id: bookingOneId,
  flightId: '6245ac45fc7968d9b1eb0362',
  userId: '6246fa11c65e3dcb08477c9f',
  seat: 'A1',
};

const setUpDatabase = async () => {
  await Booking.deleteMany({});
  await new Booking(bookingOne).save();
};

export default setUpDatabase;
