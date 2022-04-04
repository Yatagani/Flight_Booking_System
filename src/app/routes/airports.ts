import { Router } from 'express';
import * as controller from '../modules/airport/airport.controller';
import routes from '../constants/routes';
import Passport from 'passport';

const router = Router();
router.route(routes.AIRPORTS).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAirports
)

router.route(routes.AIRPORTS).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAirports
)

router.route(`${routes.AIRPORTS}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAirportDetails
)

router.route(`${routes.AIRPORTS}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteAirport
)

router.route(`${routes.AIRPORTS}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateAirport
)

export default router;
