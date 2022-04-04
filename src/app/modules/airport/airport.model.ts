import mongoose from 'mongoose';
import models from '../../constants/models';

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
});

const airportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Airport = mongoose.model(models.AIRPORT_MODEL, airportSchema);

export default Airport;
