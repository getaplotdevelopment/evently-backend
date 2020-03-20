import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateFeedback,
  validations
} from '../../middleware/validations/validateAll';
import checkToken from '../../middleware/users/checkToken';
import isAdminAuth from '../../middleware/users/isAdminAuth';
import canFeedback from '../../middleware/users/organizerOrUser';
import FeedbackController from '../../controllers/feedback';
import { checkFeedbackId } from '../../middleware/users/checkUser';

const feedback = new FeedbackController();

const router = express.Router();

router.post(
  '/',
  asyncHandler(checkToken),
  asyncHandler(canFeedback),
  validateFeedback,
  validations,
  asyncHandler(feedback.createFeedback)
);

router.get(
  '/',
  asyncHandler(checkToken),
  asyncHandler(isAdminAuth),
  asyncHandler(feedback.getAllFeedback)
);

router.get(
  '/:feedbackId',
  asyncHandler(checkToken),
  asyncHandler(isAdminAuth),
  asyncHandler(checkFeedbackId),
  asyncHandler(feedback.getOneFeedback)
);

router.put(
  '/:feedbackId',
  asyncHandler(checkToken),
  asyncHandler(canFeedback),
  asyncHandler(checkFeedbackId),
  validateFeedback,
  validations,
  asyncHandler(feedback.updateFeedback)
);

export default router;
