import * as dal from './airplane.dal';
import Airplane from './airplane.model';

export const getAirplanes = async () => {
  const airplanes = await dal.listAirplanes();
  return airplanes;
}

export const createAirplane = async ({ requestBody }) => {
  const data = new Airplane(requestBody);
  const createdAirplane = await dal.createAirplane({ data });
  return createdAirplane;
}

export const getAirplaneDetails = async ({ id }) => {
  const airplane = await dal.getSingleAirplane({ id });

  if (!airplane) {}

  return airplane;
}

export const updateAirplane = async ({ id, requestBody }) => {
  const response = await dal.updateAirplane({ id, requestBody });

  if (response.acknowledged) {
    const airplane = await dal.getSingleAirplane({ id });
    
    return airplane;
  }
}

export const deleteAirplane = async ({ id }) => {
  const airplane = await dal.getSingleAirplane({ id });
  if (!airplane) {
    return new Error('Not found');
  }
  await dal.deleteAirplane({ id });
  return;
}
