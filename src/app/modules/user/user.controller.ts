/* eslint-disable no-underscore-dangle */
import * as service from './user.service';

export const getUsers = async (req, res, next) => {
  try {
    const result = await service.getUsers({
      user: req.user,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const result = await service.getProfile({
      userId: req.params.id,
      user: req.user,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    await service.updateProfile({
      userId: req.params.id,
      requestBody: req.body,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
