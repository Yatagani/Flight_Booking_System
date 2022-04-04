import * as service from './airport.service';

export const getAirports = async (req, res, next) => {
  try {
    const result = await service.getAirports({ user: req.user });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const postAirports = async (req, res, next) => {
  try {
    const result = await service.createAirport({
      requestBody: req.body,
      user: req.user
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const getAirportDetails = async (req, res, next) => {
  try {
    const result = await service.getAirportDetails({ 
      id: req.params.id,
      user: req.user
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const updateAirport = async (req, res, next) => {
  try {
    const result = await service.updateAirport({ 
      id: req.params.id, 
      requestBody: req.body,
      user: req.user
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const deleteAirport = async (req, res, next) => {
  try {
    await service.deleteAirport({ 
      id: req.params.id, 
      user: req.user
    });
    res.status(204).send();
  } catch (e) {
    next(e)
  }
}