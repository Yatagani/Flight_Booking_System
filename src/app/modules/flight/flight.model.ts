import mongoose from 'mongoose';
import models from '../../constants/models';

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
      ref: models.AIRPORT,
    },
    flyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: models.AIRPORT,
    },
    airplaneId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: models.AIRPLANE,
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

const Flight = mongoose.model(models.FLIGHT, flightSchema);

export default Flight;
