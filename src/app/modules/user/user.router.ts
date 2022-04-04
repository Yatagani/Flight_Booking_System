import Passport from 'passport';
import { Router } from 'express';

import * as controller from './user.controller';

const router = Router();
const BASE_ROUTE = '/users';

router.route(`${BASE_ROUTE}`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getUsers,
);

router.route(`${BASE_ROUTE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getProfile,
);

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateProfile,
);

export default router;
