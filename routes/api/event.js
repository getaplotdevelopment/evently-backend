import express from 'express';
import { createEventController } from '../../controllers/event';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';
const router = express.Router();

router.post('/event', asyncHandler(authUser),validateEvent, validations, asyncHandler(createEventController));

export default router;
