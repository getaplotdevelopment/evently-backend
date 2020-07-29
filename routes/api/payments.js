import express from 'express';

import {
  makePayment,
  chargeCard,
  standardPayment,
  webhookPath
} from '../../controllers/payments';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';

const router = express.Router();

router.post('/webhook', asyncHandler(webhookPath));

router.post(
  '/momo',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(makePayment)
);

router.post(
  '/:slug/pay',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(standardPayment)
);

export default router;
