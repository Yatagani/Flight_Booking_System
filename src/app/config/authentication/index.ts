import Passport from 'passport';

import Jwt from './jwt';

const jwtAuth = () => {
  Passport.use(Jwt);
};

export default jwtAuth;
