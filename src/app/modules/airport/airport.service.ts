import * as dal from './airport.dal';
import Airport from './airport.model';
import { authorizeRequest } from '../user/user.authorize';

export const getAirports = async ({ user }) => {
  authorizeRequest({user});
  const airports = await dal.listAirports();
  return airports;
}

export const createAirport = async ({ requestBody, user }) => {
  authorizeRequest({user});
  const data = new Airport(requestBody);
  const createdAirport = await dal.createAirport({ data });
  return createdAirport;
}

export const getAirportDetails = async ({ id, user }) => {
  authorizeRequest({user});
  const airport = await dal.getSingleAirport({ id });

  if (!airport) {}

  return airport;
}

export const updateAirport = async ({ id, requestBody, user }) => {
  authorizeRequest({user});
  const response = await dal.updateAirport({ id, requestBody });

  if (response.acknowledged) {
    const airport = await dal.getSingleAirport({ id });
    console.log(airport);
    
    return airport;
  }
}

export const deleteAirport = async ({ id, user }) => {
  authorizeRequest({user});
  const airplane = await dal.getSingleAirport({ id });
  if (!airplane) {
    return new Error('Not found');
  }
  await dal.deleteAirport({ id });
  return;
}