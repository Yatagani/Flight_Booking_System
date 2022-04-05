import { Router } from 'express';
import Passport from 'passport';
import * as controller from '../modules/booking/booking.controller';
import routes from '../constants/routes';

const router = Router();

router.route(routes.BOOKING).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getBookingsList,
);

router.route(routes.BOOKING).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postBooking,
);

router.route(`${routes.BOOKING}/:id`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getBooking,
);

router.route(`${routes.BOOKING}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteBooking,
);

export default router;
