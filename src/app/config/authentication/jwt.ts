/* eslint-disable no-underscore-dangle */
import { Strategy, ExtractJwt } from 'passport-jwt';
import Jwt from 'jsonwebtoken';

import config from '../var';

// Opts -- control how the token is extracted from the request or verified.
const opts = {
  secretOrKey: config.jwtSecretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const createToken = (user) => Jwt.sign({
  _id: user._id,
  isConfirmed: user.isConfirmed,
  isAdmin: user.isAdmin,
}, opts.secretOrKey);

export const verify = (payload: any, done) => {
  if (payload?._id && payload?.isConfirmed && payload?.isAdmin !== undefined) {
    done(null, payload);
  } else {
    done(null, false);
  }
};

export default new Strategy(opts, verify);
