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
  getEventsNearCities
} from '../../controllers/event';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';

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
router.patch(
  '/events/:slug',
  upload.single('eventImage'),
  asyncHandler(checkToken),
  asyncHandler(authUser),
  asyncHandler(updateEvents)
);
router.patch(
  '/events/:slug/like',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(likeUnlikeEvent)
);
router.get('/events/liked', asyncHandler(auth), asyncHandler(likedEvent));

router.get(
  '/events/:slug/similar',
  asyncHandler(getSimilarEvents)
  )
router.get(
  '/events/:slug/nearbycity',
  asyncHandler(getEventsNearCities)
)
export default router;
