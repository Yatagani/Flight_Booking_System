import { ObjectId } from 'mongodb';
import Airplane from './airplane.model';
import { AirplaneType } from './airplane.types';

export const listAirplanes = async () => {
  const result: AirplaneType[] = await Airplane.find()
  return result;
}

export const createAirplane = async ({ data }) => {  
  const result: AirplaneType = await data.save();  
  return result;
}

export const getSingleAirplane = async ({ id }) => {
  const result: AirplaneType = await Airplane.findById(id);
  return result;
}

export const updateAirplane = async ({ id, requestBody }) => {
  console.log(id, requestBody);
  
  const result = await Airplane.updateOne({_id: id}, {$set: requestBody}, {returnOriginal: false});
  console.log(result);
  
  return result;
}

export const deleteAirplane = async ({ id }) => {
  const result = await Airplane.deleteOne({ id });
  return result;
}