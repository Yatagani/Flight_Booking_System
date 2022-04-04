import Bcrypt from 'bcryptjs';
import Crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

import * as validator from './auth.validator';
import * as dal from './auth.dal';
import * as helpers from './auth.helpers';
import * as twoFactorAuth from '../../config/authentication/two_factor_auth';
import { createToken } from '../../config/authentication/jwt';
import { UnprocessableEntity, NotFound, NotAuthenticated } from '../../utils/error';
import errors from '../../constants/errors';

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
  validator.validateUserSignUpRequest({ input: requestBody });

  const userWithTheSameEmail = await dal.findUser({
    query: {
      email: requestBody.email.toLowerCase(),
    },
  });

  if (userWithTheSameEmail) {
    throw new UnprocessableEntity(errors.DUPLICATE_EMAILS);
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
    throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
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
    isConfirmed: true,
    confirmationToken: Crypto.randomBytes(32).toString('hex'),
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  }

  return updatedUser;
};

export const logIn = async ({ requestBody }) => {
  validator.validateLogInRequest({ input: requestBody });

  const user = await dal.findUser({ query: { email: requestBody.email.toLowerCase() } });
  if (!user) {
    throw new NotAuthenticated(errors.USER_NOT_FOUND);
  }

  const passwordsMatch = await Bcrypt.compare(requestBody.password, user.password);
  if (!passwordsMatch) {
    throw new NotAuthenticated(errors.INVALID_PASSWORD);
  }

  if (!user.isConfirmed) {
    throw new NotAuthenticated(errors.ACCOUNT_NOT_CONFIRMED);
  }

  const sessionToken = createToken(user);
  const userWithToken = {
    ...user.toJSON(),
    token: sessionToken,
  };

  delete userWithToken.password;
  delete userWithToken.twoFactorAuth.secret;

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
    throw new NotFound(errors.USER_NOT_FOUND);
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
    throw new NotFound(errors.USER_NOT_FOUND);
  }
};

/**
 * Initialization of 2FA
 * 1. Create the shared TOTP secret
 * 2. Generate a QRCode from the secret
 */

export const initTwoFactorAuthentication = async ({ userId }) => {
  const query = { _id: userId };
  const user = dal.findUser({ query });

  if (!user) {
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

function checkIfUserAccountExists(user) {
  if (!user) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }
}

function checkIfTwoFactorAuthIsEnabled(user) {
  if (!user.twoFactorAuth.secret) {
    throw new UnprocessableEntity(errors.NO_2FA);
  }
}

function checkIfTokenIsValid(user, token) {
  const tokenIsNotValid = !twoFactorAuth.validateToken(
    user.twoFactorAuth.secret,
    token,
  );

  if (tokenIsNotValid) {
    throw new UnprocessableEntity(errors.INVALID_2FA_TOKEN);
  }
}

function checkIfTwoFactorAuthIsActivated(user) {
  if (!user.twoFactorAuth.active) {
    throw new UnprocessableEntity(errors.NO_2FA);
  }
}

/**
 * Enabling and Validating 2FA
 * Ensure that Auth app and backend use the same secret
 * Compare token generated by auth app with the backend
 * If equal, enable 2FA and store secret in users data in db
 */

export const completeTwoFactorAuthentication = async ({ userId, requestBody }) => {
  validator.validateCompleteTwoFactorAuthRequest({ input: requestBody });

  const { token } = requestBody;
  const query = { _id: userId };
  const user = await dal.findUser({ query });

  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsEnabled(user);
  checkIfTokenIsValid(user, token);

  const update = { 'twoFactorAuth.active': true };
  await dal.updateUser({
    query,
    content: update,
  });
};

export const verifyTwoFactorAuthToken = async ({ userId, requestParams }) => {
  validator.validateVerifyTwoFactorAuthTokenRequest({ input: requestParams });

  const { token } = requestParams;
  const user = await dal.findUser({ query: { _id: userId } });

  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsActivated(user);
  checkIfTokenIsValid(user, token);
};
