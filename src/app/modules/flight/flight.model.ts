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
      ref: models.AIRPORT_MODEL,
    },
    flyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: models.AIRPORT_MODEL,
    },
    airplaneId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: models.AIRPLANE_MODEL,
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

flightSchema.pre('validate', function (next) {
  if(this.flyingFrom.toString() === this.flyingTo.toString()) {
    this.invalidate('flyingTo', 'Destination cannot match departure place!', this.flyingTo)
  }
  if(this.departureTime >= this.arrivalTime) {
    this.invalidate('arrivalTime', 'Arrival time should be greater than departureTime!', this.arrivalTime)
  }
  next()
})

const Flight = mongoose.model(models.FLIGHT_MODEL, flightSchema);

export default Flight;
