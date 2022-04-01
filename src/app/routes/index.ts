import { Router } from 'express';

import healthRouter from './health';
import airportRouter from './airports';

const router = Router();

router.use(healthRouter);
router.use(airportRouter);

export default router;
