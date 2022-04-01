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

export const resendConfirmationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // call service  resendConfirmationEmail action
    // send response status
  } catch (e) {
    next(e);
  }
};
