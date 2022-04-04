import * as dal from './airport.dal';
import Airport from './airport.model';

export const getAirports = async () => {
  const airports = await dal.listAirports();
  return airports;
}

export const createAirport = async ({ requestBody }) => {
  const data = new Airport(requestBody);
  const createdAirport = await dal.createAirport({ data });
  return createdAirport;
}

export const getAirportDetails = async ({ id }) => {
  const airport = await dal.getSingleAirport({ id });

  if (!airport) {}

  return airport;
}

export const updateAirport = async ({ id, requestBody }) => {
  const response = await dal.updateAirport({ id, requestBody });

  if (response.acknowledged) {
    const airport = await dal.getSingleAirport({ id });
    console.log(airport);
    
    return airport;
  }
}

export const deleteAirport = async ({ id }) => {
  const airplane = await dal.getSingleAirport({ id });
  if (!airplane) {
    return new Error('Not found');
  }
  await dal.deleteAirport({ id });
  return;
}