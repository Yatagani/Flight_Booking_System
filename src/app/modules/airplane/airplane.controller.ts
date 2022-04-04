import * as service from './airplane.service';

export const getAirplanes = async (req, res, next) => {
  try {
    const result = await service.getAirplanes();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const postAirplane = async (req, res, next) => {
  try {
    const result = await service.createAirplane({requestBody: req.body});
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const getAirplaneDetails = async (req, res, next) => {
  try {
    const result = await service.getAirplaneDetails({ id: req.params.id });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const updateAirplane = async (req, res, next) => {
  try {
    const result = await service.updateAirplane({ id: req.params.id, requestBody: req.body });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const deleteAirplane = async (req, res, next) => {
  try {
    await service.deleteAirplane({ id: req.params.id });
    res.status(204).send();
  } catch (e) {
    res.status(400).send(e);
  }
}