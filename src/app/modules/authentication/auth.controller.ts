import { NextFunction, Request, Response } from 'express';
import * as service from './auth.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.signUp({ requestBody: req.body });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const confirmAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.confirmAccount({ requestParams: req.query });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const resendConfirmationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.resendConfirmationEmail({ requestBody: req.body });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.logIn({ requestBody: req.body });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const requestNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.requestNewPassword({ requestBody: req.body });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.resetPassword({ requestBody: req.body });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
