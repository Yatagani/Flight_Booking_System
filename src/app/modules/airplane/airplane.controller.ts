import * as service from './airplane.service';

export const getAirplanes = async (req, res, next) => {
  try {
    const result = await service.getAirplanes({ user: req.user });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const postAirplane = async (req, res, next) => {
  try {
    const result = await service.createAirplane({
      requestBody: req.body,
      user: req.user
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const getAirplaneDetails = async (req, res, next) => {
  try {
    const result = await service.getAirplaneDetails({ 
      id: req.params.id,
      user: req.user,
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const updateAirplane = async (req, res, next) => {
  try {
    const result = await service.updateAirplane({ 
      id: req.params.id, 
      requestBody: req.body,
      user: req.user
    });
    res.status(200).send(result);
  } catch (e) {
    next(e)
  }
}

export const deleteAirplane = async (req, res, next) => {
  try {
    await service.deleteAirplane({ 
      id: req.params.id,
      user: req.user
    });
    res.status(204).send();
  } catch (e) {
    next(e)
  }
}