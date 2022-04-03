import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

import * as validator from './auth.validator';
import * as dal from './auth.dal';
import * as helpers from './auth.helpers';
import { createToken } from '../../config/authentication/jwt';

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

export const resendConfirmationEmail = async ({ requestBody }) => {
  validator.validateResendConfirmationEmailRequest({ input: requestBody });

  const query = {
    isConfirmed: false,
    email: requestBody.email.toLowerCase(),
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    // throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
    throw new Error('User not found or account confirmed');
  }

  await helpers.sendConfirmationEmail({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });

  return updatedUser;
};

export const confirmAccount = async ({ requestParams }) => {
  validator.validateConfirmAccountRequest({ input: requestParams });

  const query = {
    isConfirmed: false,
    confirmationToken: requestParams.token,
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
    isConfirmed: true,
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    // throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
    throw new Error('User not found or account created');
  }

  return updatedUser;
};

export const logIn = async ({ requestBody }) => {
  validator.validateLogInRequest({ input: requestBody });

  const user = await dal.findUser({ query: { email: requestBody.email.toLowerCase() } });
  if (!user) {
    // throw new NotAuthenticated(errors.USER_NOT_FOUND);
    throw new Error('Invalid credentials user not found');
  }

  const passwordsMatch = await Bcrypt.compare(requestBody.password, user.password);
  if (!passwordsMatch) {
    // throw new NotAuthenticated(errors.INVALID_PASSWORD);
    throw new Error('Invalid credentials password');
  }

  if (!user.isConfirmed) {
    // throw new NotAuthenticated(errors.ACCOUNT_NOT_CONFIRMED);
    throw new Error('Invalid credentials confirmation');
  }

  const sessionToken = createToken(user);
  const userWithToken = {
    ...user.toJSON(),
    token: sessionToken,
  };

  delete userWithToken.password;
  // delete userWithToken.twoFactorAuth.secret;

  return userWithToken;
};

export const requestNewPassword = async ({ requestBody }) => {
  validator.validateResetPasswordRequest({ input: requestBody });

  const confirmationToken = Crypto.randomBytes(32).toString('hex');
  const query = { email: requestBody.email.toLowerCase() };
  const update = { confirmationToken };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    // throw new NotFound(errors.USER_NOT_FOUND);
    throw new Error('User not found');
  }

  await helpers.sendEmailWithResetPasswordLink({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });
};

export const resetPassword = async ({ requestBody }) => {
  validator.validatePasswordUpdateRequest({ input: requestBody });

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const query = { confirmationToken: requestBody.token };
  const update = { password: hashedPassword };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    // throw new NotFound(errors.USER_NOT_FOUND);
    throw new Error('User not found');
  }
};

/**
 * Initialization of 2FA
 * 1. Create the shared TOTP secret
 * 2. Generate a QRCode from the secret
 */

export const initTwoFactorAuthentication = async ({ user }) => {
  const query = { _id: user.id };
  const userExists = dal.findUser({ query });

  if (!userExists) {
    throw new Error('User does not exist');
  }

  const secret = speakeasy.generateSecret();
  const qrCodeBase64 = QRCode.toDataURL(secret.otpauth_url);

  await dal.updateUser({
    query,
    content: { 'twoFactorAuth.secret': secret },
  });

  return { qr: (await qrCodeBase64), sec: secret };
};

/**
 * Enabling and Validating 2FA
 * Ensure that Auth app and backend use the same secret
 * Compare token generated by auth app with the backend
 * If equal, enable 2FA and store secret in users data in db
 */

export const enableTwoFactorAuthentication = async () => {

};

export const validateToken = async () => {

};
