import * as dal from './flight.dal';
import Flight from './flight.model';

export const getFlights = async () => {
  const flights = await dal.listFlights();
  return flights;
}

export const createFlight = async ({ requestBody }) => {
  const data = new Flight(requestBody);
  const createdFlight = await dal.createFlight({ data });
  return createFlight;
}

export const getFlightDetails = async ({ id }) => {
  const flight = await dal.getSingleFlight({ id });

  if (!flight) {}

  return flight;
}

export const updateFlight = async ({ id, requestBody }) => {
  const response = await dal.updateFlight({ id, requestBody });

  if (response.acknowledged) {
    const flight = await dal.getSingleFlight({ id });
    
    return flight;
  }
}

export const deleteFlight = async ({ id }) => {
  const flight = await dal.getSingleFlight({ id });
  if (!flight) {
    return new Error('Not found');
  }
  await dal.deleteFlight({ id });
  return;
}