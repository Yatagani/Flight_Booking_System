import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validateUserSignUpRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).alphanum().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    redirectUrl: Joi.string().uri().required(),
  }).required();

  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
  return result;
};

export const validateResendConfirmationEmailRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    redirectUrl: Joi.string().uri().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateConfirmAccountRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateLogInRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateResetPasswordRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    redirectUrl: Joi.string().uri().required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePasswordUpdateRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(8).alphanum().required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateCompleteTwoFactorAuthRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validateVerifyTwoFactorAuthTokenRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};
