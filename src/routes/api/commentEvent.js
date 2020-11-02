import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import Comment from '../../controllers/commentEvent/commentEvent';
import LikeComment from '../../controllers/commentEvent/likeComment';
import auth from '../../middleware/users/auth';
import { checkEvent } from '../../middleware/event/checkEvent';
import {
  checkComment,
  checkCommentOwner,
  checkCommentOwnerOrAdmin
} from '../../middleware/commentEvent/checkComment';
import {
  checkReplay,
  checkReplayOwner,
  checkReplayOwnerOrAdmin
} from '../../middleware/commentEvent/checkReplay';
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
  asyncHandler(checkCommentOwner),
  asyncHandler(comment.updateComment)
);
router.put(
  '/:slug/delete-comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkEvent),
  asyncHandler(checkComment),
  asyncHandler(checkCommentOwnerOrAdmin),
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
router.put(
  '/comment/:commentId/dislike',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(likeComment.dislikeComment)
);
router.post(
  '/comment/:commentId/replay',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(replayComment.createCommentReplay)
);
router.get(
  '/comment/:commentId/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(checkReplay),
  asyncHandler(replayComment.getOneReplay)
);
router.put(
  '/comment/:commentId/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(checkReplay),
  asyncHandler(checkReplayOwner),
  asyncHandler(replayComment.updateReplay)
);
router.put(
  '/comment/:commentId/delete-replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkComment),
  asyncHandler(checkReplay),
  asyncHandler(checkReplayOwnerOrAdmin),
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
