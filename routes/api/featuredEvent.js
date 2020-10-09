import express from 'express';
import multer from 'multer';
import createFeaturedEvent from '../../controllers/featuredEvents/createFeaturedEvent';
import {
  retrieveFeaturedEvents,
  retrieveOneFeaturedEvent
} from '../../controllers/featuredEvents/retrieveFeaturedEvents';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';
import {
  checkFeaturedEvent,
  checkDates,
  checkOrganizer
} from '../../middleware/featuredEvent/checkFeatured';
import { checkEvent } from '../../middleware/event/checkEvent';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';

const router = express.Router();

const multPart = multer();

router.post(
  '/featuredEvent/:slug',
  multPart.none(),
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkOrganizer),
  asyncHandler(checkEvent),
  asyncHandler(checkDates),
  asyncHandler(createFeaturedEvent)
);
router.get('/featuredEvent/all', asyncHandler(retrieveFeaturedEvents));
router.get(
  '/featuredEvent/:slug',
  asyncHandler(checkFeaturedEvent),
  asyncHandler(retrieveOneFeaturedEvent)
);

export default router;
