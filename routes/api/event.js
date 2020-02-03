import express from 'express';
import multer from 'multer';
import {
  createEventController,
  getOrganizerEvents,
  getAllEvents
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

export default router;
