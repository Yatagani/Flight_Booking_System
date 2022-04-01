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
    throw new Error('400 - Bad requests');
  }
  return result;
};

export const test = 'test';
