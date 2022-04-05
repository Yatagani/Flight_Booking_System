import * as dal from './airport.dal';
import Airport from './airport.model';
import { BadRequest, NotFound, UnprocessableEntity } from '../../utils/error';
import { authorizeRequest } from '../user/user.authorize';
import { AirportRequestBody } from './airport.types';

export const getAirports = async ({ user }) => {
  authorizeRequest({user});
  const airports = await dal.listAirports();
  return airports;
}

export const createAirport = async ({ requestBody, user }) => {
  authorizeRequest({user});

  const requestBodyKeys = Object.keys(AirportRequestBody);
  const hasAllKeys = requestBodyKeys.every(item => requestBody.hasOwnProperty(item));
  
  if (!hasAllKeys) {
    throw new BadRequest('Property missing!');
  }

  const existingAirplane = await Airport.findOne({ name: requestBody.name });
  if (existingAirplane) {
    throw new UnprocessableEntity(`An airport with the name '${requestBody.name}' already exists in the database.`);
  }

  const data = new Airport(requestBody);
  const createdAirport = await dal.createAirport({ data });
  return createdAirport;
}

export const getAirportDetails = async ({ id, user }) => {
  authorizeRequest({user});
  const airport = await dal.getSingleAirport({ id });

  if (!airport) {
    throw new NotFound('');
  }

  return airport;
}

export const updateAirport = async ({ id, requestBody, user }) => {
  authorizeRequest({user});
  
  if (Object.keys(requestBody).length === 0) {
    throw new BadRequest('Request body does not contain data.')
  }

  const response = await dal.updateAirport({ id, requestBody });
  if (!response) {
    throw new NotFound('')
  }
  return response;
}

export const deleteAirport = async ({ id, user }) => {
  authorizeRequest({user});
  
  const airport = await dal.deleteAirport({ id });
  
  if (!airport) {
    return new Error('Not found');
  }
  
  return;
}