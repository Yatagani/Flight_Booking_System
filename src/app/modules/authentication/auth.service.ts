import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';

import * as validator from './auth.validator';
import * as dal from './auth.dal';
import * as helpers from './auth.helpers';

export interface IRequestBody {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    redirectUrl: string,
}

export interface IRequestParams {
    token: string
}

export interface INetworkRequest {
    requestBody: IRequestBody,
    requestParams?: IRequestParams,
}

export const signUp = async ({ requestBody }: INetworkRequest) => {
  // 1. Validate user sign up request
  validator.validateUserSignUpRequest({ input: requestBody });

  const userWithTheSameEmail = await dal.findUser({
    query: {
      email: requestBody.email.toLowerCase(),
    },
  });

  if (userWithTheSameEmail) {
    // Throw Error middleware instead of Error
    throw new Error('422 - Unprocessable Entity');
  }

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const newUserBody = {
    email: requestBody.email.toLocaleLowerCase(),
    password: hashedPassword,
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
    isConfirmed: false,
    twoFactorAuth: { active: false },
  };

  const createUser = await dal.createUser({ content: newUserBody });

  helpers.sendConfirmationEmail({
    user: createUser,
    redirectUrl: requestBody.redirectUrl,
  });

  return createUser;
};

export const logIn = 'login';
