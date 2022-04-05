import Flight from './flight.model';
import { FlightType } from './flight.types';

export const listFlights = async () => {
  const result: FlightType[] = await Flight.find()
  return result;
}

export const createFlight = async ({ data }) => {  
  const result: FlightType = await data.save();  
  return result;
}

export const getSingleFlight = async ({ id }) => {
  const result: FlightType = await Flight.findById(id);
  return result;
}

export const updateFlight = async ({ id, requestBody }) => {
  const result = await Flight.findByIdAndUpdate({_id: id}, {$set: requestBody}, { new: true });
  return result;
}

export const deleteFlight = async ({ id }) => {
  const result = await Flight.deleteOne({ _id: id });
  return result;
}