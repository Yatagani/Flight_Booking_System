import * as dal from './airplane.dal';
import Airplane from './airplane.model';
import { authorizeRequest } from '../user/user.authorize';
import { BadRequest, NotFound, UnprocessableEntity } from '../../utils/error';
import { AirplaneRequestBody } from './airplane.types';

export const getAirplanes = async ({ user }) => {
  authorizeRequest({user});
  const airplanes = await dal.listAirplanes();
  return airplanes;
}

export const createAirplane = async ({ requestBody, user }) => {
  authorizeRequest({user});
  
  const requestBodyKeys = Object.keys(AirplaneRequestBody);
  const hasAllKeys = requestBodyKeys.every(item => requestBody.hasOwnProperty(item));
  
  if (!hasAllKeys) {
    throw new BadRequest('Property missing!');
  }

  const existingAirplane = await Airplane.findOne({ name: requestBody.name });
  if (existingAirplane) {
    throw new UnprocessableEntity(`An airplane with the name '${requestBody.name}' already exists in the database.`);
  }

  const data = new Airplane(requestBody);
  const createdAirplane = await dal.createAirplane({ data });
  return createdAirplane;
}

export const getAirplaneDetails = async ({ id, user }) => {
  authorizeRequest({user});
  const airplane = await dal.getSingleAirplane({ id });

  if (!airplane) {
    throw new NotFound('');
  }

  return airplane;
}

export const updateAirplane = async ({ id, requestBody, user }) => {
  authorizeRequest({user});

  if (Object.keys(requestBody).length === 0) {
    throw new BadRequest('Request body does not contain data.')
  }

  const airplane = await dal.updateAirplane({ id, requestBody });
  if (!airplane) {
    throw new NotFound('');
  }
  return airplane;
}

export const deleteAirplane = async ({ id, user }) => {
  authorizeRequest({user});
  const airplane = await dal.getSingleAirplane({ id });
  if (!airplane) {
    return new NotFound('');
  }
  await dal.deleteAirplane({ id });
  return;
}
