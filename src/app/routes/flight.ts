import { Router } from 'express';
import routes from '../constants/routes';
import * as controller from '../modules/flight/flight.controller';

const router = Router();

router.route(routes.FLIGHT).get(
  controller.getFlights
);

router.route(routes.FLIGHT).post(
  controller.postFlight
);

router.route(`${routes.FLIGHT}/:id`).get(
  controller.getFlightDetails
)

router.route(`${routes.FLIGHT}/:id`).patch(
  controller.updateFlight
)

router.route(`${routes.FLIGHT}/:id`).delete(
  controller.deleteFlight
)

export default router;