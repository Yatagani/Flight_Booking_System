import { Router } from 'express';
import routes from '../constants/routes';
import * as controller from '../modules/airplane/airplane.controller';

const router = Router();

router.route(routes.AIRPLANE).get(
  controller.getAirplanes
);

router.route(routes.AIRPLANE).post(
  controller.postAirplane
);

router.route(`${routes.AIRPLANE}/:id`).get(
  controller.getAirplaneDetails
)

router.route(`${routes.AIRPLANE}/:id`).patch(
  controller.updateAirplane
)

router.route(`${routes.AIRPLANE}/:id`).delete(
  controller.deleteAirplane
)

export default router;
