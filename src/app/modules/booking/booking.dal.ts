import Booking from './booking.model';

export const createBooking = async ({ data }) => {
  const result = await data.save();
  return result;
};

export const listBooking = async (limit, skip) => {
  const result = await Booking.find({}).limit(limit).skip(skip);
  return result;
};

export const deleteBooking = async ({ id }) => {
  const result = await Booking.findByIdAndDelete({ _id: id });
  return result;
};

export const readBooking = async ({ id }) => {
  const result = await Booking.findById({ _id: id });

  return result;
};
