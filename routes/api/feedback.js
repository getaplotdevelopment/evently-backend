import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateFeedback,
  validations
} from '../../middleware/validations/validateAll';
import checkToken from '../../middleware/users/checkToken';
import FeedbackController from '../../controllers/feedback';

const feedback = new FeedbackController();

const router = express.Router();

router.post(
  '/',
  asyncHandler(checkToken),
  validateFeedback,
  validations,
  asyncHandler(feedback.createFeedback)
);

export default router;
