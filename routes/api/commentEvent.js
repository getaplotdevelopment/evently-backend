import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import Comment from '../../controllers/commentEvent/commentEvent';
import LikeComment from '../../controllers/commentEvent/likeComment';
import auth from '../../middleware/users/auth';
import { checkEvent } from '../../middleware/event/checkEvent';
import { checkComment } from '../../middleware/commentEvent/checkComment';
import { checkReplay } from '../../middleware/commentEvent/checkReplay';
import {
  validateComment,
  validations
} from '../../middleware/validations/validateAll';
import ReplayCommentController from '../../controllers/commentEvent/replayComment';

const comment = new Comment();
const likeComment = new LikeComment();
const replayComment = new ReplayCommentController();

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
router.put(
  '/:slug/replay-comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkComment),
  asyncHandler(comment.reportCommentEvent)
);
router.put(
  '/comment/:commentId/like',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(likeComment.likeComment)
);
router.post(
  '/comment/:commentId/replay',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(replayComment.createCommentReplay)
);
router.get(
  '/comment/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(replayComment.getOneReplay)
);
router.put(
  '/comment/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(replayComment.updateReplay)
);
router.put(
  '/comment/delete-replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(replayComment.deleteReplay)
);
router.post(
  '/comment/report-replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(replayComment.reportReplayComment)
);

export default router;
