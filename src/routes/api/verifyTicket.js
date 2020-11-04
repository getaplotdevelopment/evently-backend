import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import authUser from '../../middleware/users/authUser';
import VerifyTicketController from '../../controllers/ticket/verifyTicket';
import VerifyTicketMiddleware from '../../middleware/tickets/verifyTicket';

const router = express.Router();

router.put(
  '/verifyTicket/:slug',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(VerifyTicketMiddleware.verifyTicket),
  asyncHandler(VerifyTicketController.verifyTicket)
);
router.put(
  '/unverifyTicket/:slug',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(VerifyTicketMiddleware.unverifyTicket),
  asyncHandler(VerifyTicketController.unverifyTicket)
);

router.get(
  '/verifyTickets',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(VerifyTicketController.getVerifiedTicketsByCustomerOrEvent)
);

router.get(
  '/verifyTickets/all',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(VerifyTicketController.getAllVerifiedTickets)
);

router.get(
  '/verifyTickets/:slug/:customerId',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(VerifyTicketController.customerTicketsWithEvent)
);

export default router;
