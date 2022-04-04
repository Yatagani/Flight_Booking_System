import { Router } from 'express';

import healthRouter from './health';
import authRouter from '../modules/authentication/auth.router';
import userRouter from '../modules/user/user.router';
import bookingRouter from './booking';

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userRouter);
router.use(bookingRouter);

export default router;
