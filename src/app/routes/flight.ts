import { Router } from 'express';
import Passport from 'passport';
import routes from '../constants/routes';
import * as controller from '../modules/flight/flight.controller';

const router = Router();

router.route(routes.FLIGHT).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getFlights
);

router.route(routes.FLIGHT).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postFlight
);

router.route(`${routes.FLIGHT}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getFlightDetails
)

router.route(`${routes.FLIGHT}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateFlight
)

router.route(`${routes.FLIGHT}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteFlight
)

export default router;