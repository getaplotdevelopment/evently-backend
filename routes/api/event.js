import express from 'express';
import multer from 'multer';
import {
  createEventController,
  getOrganizerEvents,
  getAllEvents,
  updateEvents,
  likeUnlikeEvent,
  likedEvent
} from '../../controllers/event';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth'

const router = express.Router();
const upload = multer();

router.post(
  '/events',
  upload.single('eventImage'),
  asyncHandler(authUser),
  validateEvent,
  validations,
  asyncHandler(createEventController)
);

router.get('/events', asyncHandler(authUser), asyncHandler(getOrganizerEvents));
router.get('/events/all', asyncHandler(getAllEvents));
router.patch(
  '/events/:slug',
  upload.single('eventImage'),
  asyncHandler(authUser),
  asyncHandler(updateEvents)
);
router.patch('/events/:slug/like', asyncHandler(auth), asyncHandler(likeUnlikeEvent));
router.get('/events/liked', asyncHandler(auth), asyncHandler(likedEvent));

export default router;
