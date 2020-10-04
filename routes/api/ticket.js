import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import authUser from '../../middleware/users/authUser';
import checkToken from '../../middleware/users/checkToken';
import auth from '../../middleware/users/auth';
import Ticket from '../../controllers/ticket';
import {
  validations,
  validateTicket
} from '../../middleware/validations/validateAll';
import { checkEvent } from '../../middleware/event/checkEvent';
import {
  checkTicketExist,
  checkTicket,
  checkAccessTicket
} from '../../middleware/tickets/ticket';

const {
  createTicket,
  getAllTicket,
  getAllTicketByEvent,
  getOneTicket,
  updateTicket,
  updateTicketsByCategory,
  upcomingEventTickets,
  pastEventTickets
} = new Ticket();

const router = express.Router();

router.post(
  '/:slug',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  // asyncHandler(checkTicketExist),
  validateTicket,
  validations,
  asyncHandler(checkEvent),
  asyncHandler(createTicket)
);
router.get('/', asyncHandler(auth), asyncHandler(getAllTicket));
router.get('/upcoming', asyncHandler(auth), asyncHandler(upcomingEventTickets));
router.get('/past', asyncHandler(auth), asyncHandler(pastEventTickets));
router.get(
  '/:slug',
  asyncHandler(checkEvent),
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(getAllTicketByEvent)
);
router.get(
  '/:slug/:ticketId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkTicket),
  asyncHandler(getOneTicket)
);
router.put(
  '/:slug/:ticketId',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(checkEvent),
  asyncHandler(checkTicket),
  asyncHandler(checkAccessTicket),
  asyncHandler(updateTicket)
);
router.put(
  '/:slug/',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(checkEvent),
  asyncHandler(checkAccessTicket),
  asyncHandler(updateTicketsByCategory)
);
export default router;
