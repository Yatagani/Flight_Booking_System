/* eslint-disable no-underscore-dangle */
import * as validator from './user.validator';
import * as dal from './user.dal';
import * as authorization from './user.authorize';
import { NotFound, UnprocessableEntity } from '../../utils/error';
import errors from '../../constants/errors';

export const getUsers = async ({ user }) => {
  authorization.authorizeRequest({ user });

  const query = {};
  const projection = [
    'firstName',
    'lastName',
    'email',
  ];

  const users = await dal.findUsers({ query, projection });

  return users;
};

export const getProfile = async ({ userId, user }) => {
  const requestParams = { id: userId };
  validator.validateGetProfileRequest({ input: requestParams });
  authorization.authorizeRequest({ user });

  const query = { _id: userId };
  const projection = [
    'firstName',
    'lastName',
    'email',
  ];

  const userFromDB = await dal.findOneUser({ query, projection });

  if (!userFromDB) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }

  return userFromDB;
};

export const updateProfile = async ({ userId, requestBody, user }) => {
  validator.validateUpdateProfileRequest({ input: requestBody });
  authorization.authorizeRequest({ user });

  const query = { _id: userId };
  const userFromDB = await dal.findOneUser({ query });

  if (!userFromDB) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }

  if (requestBody.firstName || requestBody.lastName) {
    const newFirstName = requestBody.firstName;
    const newLastName = requestBody.lastName;
    const existingUser = await dal.findUserToUpdate({
      query: {
        equal: {
          firstName: newFirstName,
          lastName: newLastName,
        },
        notEqual: {
          _id: userFromDB._id,
        },
      },
    });

    if (existingUser) {
      throw new UnprocessableEntity(errors.USER_EXISTS);
    }
  }

  await dal.updateUser({
    query: { _id: userId },
    content: requestBody,
  });
};
