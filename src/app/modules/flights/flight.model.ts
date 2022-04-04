import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  departureTime: {
    type: String,
    required: true,
    trim: true,
  },
  arrivalTime: {
    type: String,
    required: true,
    trim: true,
  },
  flyingFrom: {
    type: String,
    required: true,
    trim: true,
  },
  flyingTo: {
    type: String,
    required: true,
    trim: true,
  },
  airplaneId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Airport',
  },
  defaultPrice: {
    type: Number,
    required: true,
    trim: true,
  },
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
