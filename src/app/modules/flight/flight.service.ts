import { authorizeRequest } from '../user/user.authorize';
import * as dal from './flight.dal';
import Flight from './flight.model';
import Airplane from '../airplane/airplane.model';
import Airport from '../airport/airport.model';
import { UnprocessableEntity, BadRequest, NotFound } from '../../utils/error';
import { FlightRequestBody } from './flight.types';

export const getFlights = async ({ user }) => {
  authorizeRequest({user});
  const flights = await dal.listFlights();
  return flights;
}

export const createFlight = async ({ requestBody, user }) => {
  authorizeRequest({user});
  const requestBodyKeys = Object.keys(FlightRequestBody);
  const hasAllKeys = requestBodyKeys.every(item => requestBody.hasOwnProperty(item));
  
  if (!hasAllKeys) {
    throw new BadRequest('Property missing!');
  }

  const departureAirport = await Airport.findOne({ _id: requestBody.flyingFrom });
  const arrivalAirport = await Airport.findOne({ _id: requestBody.flyingTo });
  const airplane = await Airplane.findOne({ _id: requestBody.airplaneId });
  
  if (!departureAirport) {
    throw new NotFound('The flyingFrom airport does not exist in the database!')
  }
  if (!arrivalAirport) {
    throw new NotFound('The flyingTo airport does not exist in the database!')
  }
  if (!airplane) {
    throw new NotFound('The airplane does not exist in the database!')
  }

  if (requestBody.departureTime >= requestBody.arrivalTime) {
    throw new UnprocessableEntity('Arrival time should be greater than departureTime!');
  }

  if (requestBody.flyingFrom === requestBody.flyingTo) {
    throw new UnprocessableEntity('Destination cannot match departure place!');
  }
  
  const data = new Flight(requestBody);
  const createdFlight = await dal.createFlight({ data });
  return createdFlight;
}

export const getFlightDetails = async ({ id, user }) => {
  authorizeRequest({user});
  const flight = await dal.getSingleFlight({ id });

  if (!flight) {
    throw new NotFound('');
  }

  return flight;
}

export const updateFlight = async ({ id, requestBody, user }) => {
  authorizeRequest({user});

  if (Object.keys(requestBody).length === 0) {
    throw new BadRequest('Request body does not contain data.')
  }

  if (requestBody.flyingFrom) {
    const departureAirport = await Airport.findOne({ _id: requestBody.flyingFrom });

    if (!departureAirport) {
      throw new NotFound('The flyingFrom airport does not exist in the database!')
    }
  }

  if (requestBody.flyingTo) {
    const arrivalAirport = await Airport.findOne({ _id: requestBody.flyingTo });

    if (!arrivalAirport) {
      throw new NotFound('The flyingTo airport does not exist in the database!')
    }
  }

  if (requestBody.airplaneId) {
    const airplane = await Airplane.findOne({ _id: requestBody.airplaneId });

    if (!airplane) {
      throw new NotFound('The airplane does not exist in the database!')
    }
  }

  const flight = await dal.updateFlight({ id, requestBody });

  if (!flight) {
    throw new NotFound('');
  }
  return flight;
}

export const deleteFlight = async ({ id, user }) => {
  authorizeRequest({user});
  const flight = await dal.getSingleFlight({ id });
  if (!flight) {
    return new Error('Not found');
  }
  await dal.deleteFlight({ id });
  return;
}