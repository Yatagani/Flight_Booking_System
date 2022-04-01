import { Router } from 'express';

import healthRouter from './health';
import airplaneRouter from './airplane';

const router = Router();

router.use(healthRouter);
router.use(airplaneRouter);

export default router;
