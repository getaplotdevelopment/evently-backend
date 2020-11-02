import express from 'express';
import multer from 'multer';
import {
  createEventController,
  getOrganizerEvents,
  getAllEvents,
  updateEvents,
  likeUnlikeEvent,
  likedEvent,
  getSimilarEvents,
  getEventsNearCities,
  getUserLocationEvents,
  singleEvent,
  eventTicketCategory,
  getUserEventTickets,
  getSingleUserTicket
} from '../../controllers/event';
import { checkEvent } from '../../middleware/event/checkEvent';
import { usersPaidForEvent, eventAttendees } from '../../controllers/payments';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';
import {  checkPaidEventTicket } from '../../middleware/tickets/ticket';

const router = express.Router();
const upload = multer();

router.post(
  '/events',
  upload.single('eventImage'),
  asyncHandler(checkToken),
  asyncHandler(authUser),
  validateEvent,
  validations,
  asyncHandler(createEventController)
);

router.get(
  '/events',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(getOrganizerEvents)
);
router.get('/events/all', asyncHandler(getAllEvents));
router.get('/events/userlocation', asyncHandler(getUserLocationEvents));
router.patch(
  '/events/:slug',
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(updateEvents)
);
router.patch(
  '/events/:slug/like',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(likeUnlikeEvent)
);
router.get('/events/liked', asyncHandler(auth), asyncHandler(likedEvent));

router.get('/events/:slug/similar', asyncHandler(getSimilarEvents));
router.get('/events/:slug/nearbycity', asyncHandler(getEventsNearCities));
router.get(
  '/events/:slug/users',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(usersPaidForEvent)
);
router.get(
  '/events/:slug/attend',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(eventAttendees)
);
router.get('/events/:slug', asyncHandler(singleEvent));
router.get(
  '/category/events/:slug',
  asyncHandler(checkEvent),
  asyncHandler(eventTicketCategory)
);
router.get(
  '/events/:slug/tickets',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(getUserEventTickets)
);
router.get(
  '/events/:slug/tickets/:ticketId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkPaidEventTicket),
  asyncHandler(getSingleUserTicket)
);

export default router;
