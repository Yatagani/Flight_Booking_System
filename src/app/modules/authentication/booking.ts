import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    flightScheduleId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    seat: {
      type: String,
      required: true,
    },
  },
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
