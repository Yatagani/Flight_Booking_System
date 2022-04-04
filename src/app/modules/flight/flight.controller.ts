import * as service from './flight.service';

export const getFlights = async (req, res, next) => {
  try {
    const result = await service.getFlights();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const postFlight = async (req, res, next) => {
  try {
    const result = await service.createFlight({requestBody: req.body});
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const getFlightDetails = async (req, res, next) => {
  try {
    const result = await service.getFlightDetails({ id: req.params.id });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const updateFlight = async (req, res, next) => {
  try {
    const result = await service.updateFlight({ id: req.params.id, requestBody: req.body });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
}

export const deleteFlight = async (req, res, next) => {
  try {
    await service.deleteFlight({ id: req.params.id });
    res.status(204).send();
  } catch (e) {
    res.status(400).send(e);
  }
}