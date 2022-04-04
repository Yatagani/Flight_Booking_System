import { Router } from 'express';

import healthRouter from './health';
import flightRouter from './flight';

const router = Router();

router.use(healthRouter);
router.use(flightRouter);

export default router;
