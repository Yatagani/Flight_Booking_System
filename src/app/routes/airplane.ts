import { Router } from 'express';
import Passport from 'passport';
import routes from '../constants/routes';
import * as controller from '../modules/airplane/airplane.controller';

const router = Router();

router.route(routes.AIRPLANE).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAirplanes
);

router.route(routes.AIRPLANE).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAirplane
);

router.route(`${routes.AIRPLANE}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAirplaneDetails
)

router.route(`${routes.AIRPLANE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateAirplane
)

router.route(`${routes.AIRPLANE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteAirplane
)

export default router;
