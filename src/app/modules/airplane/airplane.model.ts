import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatName: {
    type: String,
    required: true,
    trim: true,
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

const Airplane = mongoose.model('Airplane', airplaneSchema);

export default Airplane;
