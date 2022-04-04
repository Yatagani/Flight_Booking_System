import * as service from './airport.service';

export const getAirports = async (req, res, next) => {
  try {
    const result = await service.getAirports();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const postAirports = async (req, res, next) => {
  try {
    const result = await service.createAirport({requestBody: req.body});
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const getAirportDetails = async (req, res, next) => {
  try {
    const result = await service.getAirportDetails({ id: req.params.id });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const updateAirport = async (req, res, next) => {
  try {
    const result = await service.updateAirport({ id: req.params.id, requestBody: req.body });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const deleteAirport = async (req, res, next) => {
  try {
    await service.deleteAirport({ id: req.params.id });
    res.status(204).send();
  } catch (e) {
    res.status(400).send(e);
  }
}