import { Router } from 'express';

const router = Router();

router.route('/health').get(
  (_req, res) => {
    res.status(200).json({
      appName: 'Flight Booking System Guide',
      version: process.env.npm_package_version,
      status: 'OK',
    });
  },
);

export default router;
