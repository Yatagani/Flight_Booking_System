/* eslint-disable import/prefer-default-export */
import { NotAuthorized } from '../../utils/error';
import errors from '../../constants/errors';

export const authorizeRequest = ({ user }) => {
  if (!user.isAdmin) {
    throw new NotAuthorized(errors.USER_NOT_FOUND);
  }
};