import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import Comment from '../../controllers/commentEvent/commentEvent';
import auth from '../../middleware/users/auth';
import { checkEvent } from '../../middleware/event/checkEvent';
import { checkComment } from '../../middleware/commentEvent/checkComment';
import {
  validateComment,
  validations
} from '../../middleware/validations/validateAll';

const comment = new Comment();

const router = express.Router();

router.post(
  '/:slug/post-comment',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  validateComment,
  validations,
  asyncHandler(comment.createComment)
);
router.get(
  '/:slug/event-comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkComment),
  asyncHandler(comment.getOneComment)
);
router.put(
  '/:slug/event-comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkComment),
  asyncHandler(comment.updateComment)
);
router.put(
  '/:slug/delete-comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkComment),
  asyncHandler(comment.deleteComment)
);

export default router;
