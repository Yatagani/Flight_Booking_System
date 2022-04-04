import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validateGetProfileRequest = ({ input }) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
  return result;
};

export const validateUpdateProfileRequest = ({ input }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email(),
  }).required();

  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
  return result;
};
