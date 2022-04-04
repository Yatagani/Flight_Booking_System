import mongoose from 'mongoose';
import models from '../../constants/models';

const seatSchema = new mongoose.Schema({
  seatName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
});

const airplaneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    seats: {
      type: [
        seatSchema,
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Airplane = mongoose.model(models.AIRPLANE, airplaneSchema);

export default Airplane;
