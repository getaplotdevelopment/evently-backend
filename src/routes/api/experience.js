import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import Experience from '../../controllers/experiences/experience';
import ExperienceComment from '../../controllers/experiences/commentExperience';
import ExperienceCommentReplay from '../../controllers/experiences/replayComment';
import ExperienceLike from '../../controllers/experiences/likeExperience';
import ExperienceLikeComment from '../../controllers/experiences/likeCommentExperience';
import auth from '../../middleware/users/auth';
import {
  checkExperience,
  checkExperienceComment,
  checkReplay,
  checkExperienceOwner,
  checkExperienceOwnerOrAdmin,
  checkCommentOwner,
  checkCommentOwnerOradmin,
  checkReplayOwnerOradmin
} from '../../middleware/experience/checkExperience';
import {
  validateExperience,
  validations
} from '../../middleware/validations/validateAll';

const experience = new Experience();
const experienceComment = new ExperienceComment();
const experienceLike = new ExperienceLike();
const experienceCommentLike = new ExperienceLikeComment();
const experienceCommentReplay = new ExperienceCommentReplay();

const router = express.Router();

router.post(
  '/post-experience',
  asyncHandler(checkToken),
  asyncHandler(auth),
  validateExperience,
  validations,
  asyncHandler(experience.createExperience)
);
router.get(
  '/:experienceId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(experience.getOneExperience)
);
router.get(
  '/',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(experience.getAllExperience)
);
router.put(
  '/:experienceId/update-experience',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceOwner),
  asyncHandler(experience.updateExperience)
);
router.put(
  '/:experienceId/delete-experience',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceOwnerOrAdmin),
  asyncHandler(experience.deleteExperience)
);
router.post(
  '/report-experience/:experienceId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(experience.reportExperience)
);
router.post(
  '/:experienceId/comment',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(experienceComment.createComment)
);
router.get(
  '/:experienceId/comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceComment),
  asyncHandler(experienceComment.getOneComment)
);
router.put(
  '/:experienceId/comment/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceComment),
  asyncHandler(checkCommentOwner),
  asyncHandler(experienceComment.updateComment)
);
router.put(
  '/:experienceId/comment/:commentId/delete-comment',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceComment),
  asyncHandler(checkCommentOwnerOradmin),
  asyncHandler(experienceComment.deleteComment)
);
router.post(
  '/report-comment-experience/:commentId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperienceComment),
  asyncHandler(experienceComment.reportCommentExperience)
);
router.put(
  '/:experienceId/like',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(experienceLike.likeExperience)
);
router.put(
  '/:experienceId/dislike',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(experienceLike.dislikeExperience)
);
router.put(
  '/:experienceId/comment/:commentId/like',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceComment),
  asyncHandler(experienceCommentLike.LikeCommentExperience)
);
router.put(
  '/:experienceId/comment/:commentId/dislike',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperience),
  asyncHandler(checkExperienceComment),
  asyncHandler(experienceCommentLike.dislikeCommentExperience)
);
router.post(
  '/comment/:commentId/replay',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperienceComment),
  validateExperience,
  validations,
  asyncHandler(experienceCommentReplay.createCommentReplay)
);
router.get(
  '/comment/:commentId/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperienceComment),
  asyncHandler(checkReplay),
  asyncHandler(experienceCommentReplay.getOneReplay)
);

router.put(
  '/comment/:commentId/replay/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkExperienceComment),
  asyncHandler(checkReplay),
  asyncHandler(experienceCommentReplay.updateReplay)
);
router.put(
  '/comment/:commentId/replay/:replayId/delete-replay',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(checkExperienceComment),
  asyncHandler(checkReplayOwnerOradmin),
  asyncHandler(experienceCommentReplay.deleteReplay)
);
router.post(
  '/report-replay-comment-experience/:replayId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkReplay),
  asyncHandler(experienceCommentReplay.reportReplayCommentExperience)
);

export default router;
