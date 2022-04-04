import * as dal from './airplane.dal';
import Airplane from './airplane.model';
import { authorizeRequest } from '../user/user.authorize';

export const getAirplanes = async ({ user }) => {
  authorizeRequest({user});
  const airplanes = await dal.listAirplanes();
  return airplanes;
}

export const createAirplane = async ({ requestBody, user }) => {
  authorizeRequest({user});
  const data = new Airplane(requestBody);
  const createdAirplane = await dal.createAirplane({ data });
  return createdAirplane;
}

export const getAirplaneDetails = async ({ id, user }) => {
  authorizeRequest({user});
  const airplane = await dal.getSingleAirplane({ id });

  if (!airplane) {}

  return airplane;
}

export const updateAirplane = async ({ id, requestBody, user }) => {
  authorizeRequest({user});
  const response = await dal.updateAirplane({ id, requestBody });

  if (response.acknowledged) {
    const airplane = await dal.getSingleAirplane({ id });
    
    return airplane;
  }
}

export const deleteAirplane = async ({ id, user }) => {
  authorizeRequest({user});
  const airplane = await dal.getSingleAirplane({ id });
  if (!airplane) {
    return new Error('Not found');
  }
  await dal.deleteAirplane({ id });
  return;
}
