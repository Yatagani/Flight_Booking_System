import mongoose from 'mongoose';
import Airport from '../../app/modules/airport/airport.model';

export const airport1 = new Airport({
  name: 'Airport1',
    address: {
      country: 'Country1',
      city: 'City1',
      street: 'Street1',
      zipCode: 1000,
    },
})

export const setUpDatabase = async () => {
  await Airport.deleteMany();
  await airport1.save();
}
