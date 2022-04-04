/* eslint-disable import/prefer-default-export */
import { NotAuthorized } from '../../utils/error';
import errors from '../../constants/errors';

export const authorizeRequest = ({ user }) => {
  if (!user.isAdmin) {
    console.log('start');
    throw new NotAuthorized(errors.USER_NOT_FOUND);
  }
  console.log('stop');
};
