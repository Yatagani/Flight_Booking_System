import { Router } from 'express';

import healthRouter from './health';
import booking from './booking';

const router = Router();

router.use(healthRouter);
router.use(booking);

export default router;
