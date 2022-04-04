import { Router } from 'express';

import healthRouter from './health';
import flightRouter from './flight';
import airplaneRouter from './airplane';
import airportRouter from './airports';
import authRouter from '../modules/authentication/auth.router';
import userRouter from '../modules/user/user.router';
import bookingRouter from './booking';

const router = Router();

router.use(healthRouter);
router.use(flightRouter);
router.use(airplaneRouter);
router.use(airportRouter);
router.use(authRouter);
router.use(userRouter);
router.use(bookingRouter);

export default router;
