import { Router } from 'express';

import healthRouter from './health';
import authRouter from '../modules/authentication/auth.router';

const router = Router();

router.use(healthRouter);
router.use(authRouter);

export default router;
