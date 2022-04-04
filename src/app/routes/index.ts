import { Router } from 'express';

import healthRouter from './health';
import authRouter from '../modules/authentication/auth.router';
import userRouter from '../modules/user/user.router';

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userRouter);

export default router;
