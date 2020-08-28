import express from 'express';

import {
  makePayment,
  chargeCard,
  standardPayment,
  webhookPath,
  attendFree,
  cancelFreeAttendance
} from '../../controllers/payments';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';
import { checkEvent } from '../../middleware/event/checkEvent';
import { checkTicketEvent } from '../../middleware/tickets/ticket';
import { validateFreePayment, validations, validatePaidPayment } from '../../middleware/validations/validateAll';

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
  validatePaidPayment,
  validations,
  asyncHandler(checkEvent),
  asyncHandler(checkTicketEvent),
  asyncHandler(standardPayment)
);

router.post(
  '/:slug/free',
  asyncHandler(checkToken),
  asyncHandler(auth),
  validateFreePayment,
  validations,
  asyncHandler(checkEvent),
  asyncHandler(checkTicketEvent),
  asyncHandler(attendFree)
);

router.put(
  '/:slug/:ticketId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(cancelFreeAttendance)
);

export default router;
