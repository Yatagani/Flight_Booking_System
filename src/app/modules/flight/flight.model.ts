import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Airport',
    },
    flyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Airport',
    },
    airplaneId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Airplane',
    },
    defaultPrice: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
