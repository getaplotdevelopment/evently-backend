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

router.post(
  '/webhook',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(webhookPath)
);

export default router;
