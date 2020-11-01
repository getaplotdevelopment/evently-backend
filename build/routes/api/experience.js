"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _experience = require("../../controllers/experiences/experience");

var _experience2 = _interopRequireDefault(_experience);

var _commentExperience = require("../../controllers/experiences/commentExperience");

var _commentExperience2 = _interopRequireDefault(_commentExperience);

var _replayComment = require("../../controllers/experiences/replayComment");

var _replayComment2 = _interopRequireDefault(_replayComment);

var _likeExperience = require("../../controllers/experiences/likeExperience");

var _likeExperience2 = _interopRequireDefault(_likeExperience);

var _likeCommentExperience = require("../../controllers/experiences/likeCommentExperience");

var _likeCommentExperience2 = _interopRequireDefault(_likeCommentExperience);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkExperience = require("../../middleware/experience/checkExperience");

var _validateAll = require("../../middleware/validations/validateAll");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const experience = new _experience2.default();
const experienceComment = new _commentExperience2.default();
const experienceLike = new _likeExperience2.default();
const experienceCommentLike = new _likeCommentExperience2.default();
const experienceCommentReplay = new _replayComment2.default();

const router = _express2.default.Router();

router.post('/post-experience', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), _validateAll.validateExperience, _validateAll.validations, (0, _asyncHandler2.default)(experience.createExperience));
router.get('/:experienceId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(experience.getOneExperience));
router.get('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(experience.getAllExperience));
router.put('/:experienceId/update-experience', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceOwner), (0, _asyncHandler2.default)(experience.updateExperience));
router.put('/:experienceId/delete-experience', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceOwnerOrAdmin), (0, _asyncHandler2.default)(experience.deleteExperience));
router.post('/report-experience/:experienceId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(experience.reportExperience));
router.post('/:experienceId/comment', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(experienceComment.createComment));
router.get('/:experienceId/comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(experienceComment.getOneComment));
router.put('/:experienceId/comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(_checkExperience.checkCommentOwner), (0, _asyncHandler2.default)(experienceComment.updateComment));
router.put('/:experienceId/comment/:commentId/delete-comment', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(_checkExperience.checkCommentOwnerOradmin), (0, _asyncHandler2.default)(experienceComment.deleteComment));
router.post('/report-comment-experience/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(experienceComment.reportCommentExperience));
router.put('/:experienceId/like', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(experienceLike.likeExperience));
router.put('/:experienceId/dislike', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(experienceLike.dislikeExperience));
router.put('/:experienceId/comment/:commentId/like', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(experienceCommentLike.LikeCommentExperience));
router.put('/:experienceId/comment/:commentId/dislike', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperience), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(experienceCommentLike.dislikeCommentExperience));
router.post('/comment/:commentId/replay', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), _validateAll.validateExperience, _validateAll.validations, (0, _asyncHandler2.default)(experienceCommentReplay.createCommentReplay));
router.get('/comment/:commentId/replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(_checkExperience.checkReplay), (0, _asyncHandler2.default)(experienceCommentReplay.getOneReplay));
router.put('/comment/:commentId/replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(_checkExperience.checkReplay), (0, _asyncHandler2.default)(experienceCommentReplay.updateReplay));
router.put('/comment/:commentId/replay/:replayId/delete-replay', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkReplay), (0, _asyncHandler2.default)(_checkExperience.checkExperienceComment), (0, _asyncHandler2.default)(_checkExperience.checkReplayOwnerOradmin), (0, _asyncHandler2.default)(experienceCommentReplay.deleteReplay));
router.post('/report-replay-comment-experience/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkExperience.checkReplay), (0, _asyncHandler2.default)(experienceCommentReplay.reportReplayCommentExperience));
exports.default = router;