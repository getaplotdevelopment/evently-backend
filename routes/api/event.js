import express from 'express';
import multer from 'multer';
import {
  createEventController,
  getOrganizerEvents,
  getAllEvents,
  updateEvents,
  likeUnlikeEvents
} from '../../controllers/event';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';

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
router.patch('/events/:slug/like', asyncHandler(authUser), asyncHandler(likeUnlikeEvents));

export default router;
