import Passport from 'passport';
import { Router } from 'express';

import * as controller from './auth.controller';

const router = Router();
const BASE_ROUTE = '/auth';

router.route(`${BASE_ROUTE}/register`).post(
  controller.registerUser,
);

router.route(`${BASE_ROUTE}/resend-confirmation-email`).post(
  controller.resendConfirmationEmail,
);

router.route(`${BASE_ROUTE}/confirmation`).put(
  controller.confirmAccount,
);

router.route(`${BASE_ROUTE}/login`).post(
  controller.logIn,
);

router.route(`${BASE_ROUTE}/request-new-password`).post(
  controller.requestNewPassword,
);

router.route(`${BASE_ROUTE}/password`).put(
  controller.resetPassword,
);

router.route(`${BASE_ROUTE}/two-factor-auth/initialization`).put(
  Passport.authenticate('jwt', { session: false }),
  controller.initTwoFactorAuthentication,
);

// router.route(`${BASE_ROUTE}/two-factor-auth/activation`).put(
//   Passport.authenticate('jwt', { session: false }),
//   controller.enableTwoFactorAuthentication,
// );

// router.route(`${BASE_ROUTE}/two-factor-auth/verification`).head(
//   Passport.authenticate('jwt', { session: false }),
//   controller.verifyTwoFactorAuthToken,
// );

export default router;
