import Airport from './airport.model';
import { AirportType } from './airport.types';

export const listAirports = async () => {
  const result: AirportType[] = await Airport.find()
  return result;
}

export const createAirport = async ({ data }) => {  
  const result: AirportType = await data.save();  
  return result;
}

export const getSingleAirport = async ({ id }) => {
  const result: AirportType = await Airport.findById(id);
  return result;
}

export const updateAirport = async ({ id, requestBody }) => {  
  const result = await Airport.updateOne({_id: id}, {$set: requestBody}, {returnOriginal: false});
  return result;
}

export const deleteAirport = async ({ id }) => {
  const result = await Airport.deleteOne({ _id: id });
  return result;
}