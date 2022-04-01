import Joi from 'joi';

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
    //    throw new BadRequest(result?.error?.details)
    throw new Error('400 - Bad requests during signUp');
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
    // throw new BadRequest(result?.error?.details);
    throw new Error('400 - Bad requests while resending confirmation email');
  }
};

export const validateConfirmAccountRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    // throw new BadRequest(result?.error?.details);
    throw new Error('400 - Bad requests during account confirmation');
  }
};

export const validateLogInRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    // throw new BadRequest(result?.error?.details);
    throw new Error('400 - Bad requests during login');
  }
};

export const validateResetPasswordRequest = ({ input }) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    redirectUrl: Joi.string().uri().required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    // throw new BadRequest(result?.error?.details);
    throw new Error('400 - Bad requests during password reset');
  }
};

export const validatePasswordUpdateRequest = ({ input }) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(8).alphanum().required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    // throw new BadRequest(result?.error?.details);
    throw new Error('400 - Bad requests during password update');
  }
};
