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

var _commentEvent = require("../../controllers/commentEvent/commentEvent");

var _commentEvent2 = _interopRequireDefault(_commentEvent);

var _likeComment = require("../../controllers/commentEvent/likeComment");

var _likeComment2 = _interopRequireDefault(_likeComment);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkEvent = require("../../middleware/event/checkEvent");

var _checkComment = require("../../middleware/commentEvent/checkComment");

var _checkReplay = require("../../middleware/commentEvent/checkReplay");

var _validateAll = require("../../middleware/validations/validateAll");

var _replayComment = require("../../controllers/commentEvent/replayComment");

var _replayComment2 = _interopRequireDefault(_replayComment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const comment = new _commentEvent2.default();
const likeComment = new _likeComment2.default();
const replayComment = new _replayComment2.default();

const router = _express2.default.Router();

router.post('/:slug/post-comment', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), _validateAll.validateComment, _validateAll.validations, (0, _asyncHandler2.default)(comment.createComment));
router.get('/:slug/event-comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(comment.getOneComment));
router.put('/:slug/event-comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(_checkComment.checkCommentOwner), (0, _asyncHandler2.default)(comment.updateComment));
router.put('/:slug/delete-comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(_checkComment.checkCommentOwnerOrAdmin), (0, _asyncHandler2.default)(comment.deleteComment));
router.put('/:slug/replay-comment/:commentId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(comment.reportCommentEvent));
router.put('/comment/:commentId/like', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(likeComment.likeComment));
router.put('/comment/:commentId/dislike', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(likeComment.dislikeComment));
router.post('/comment/:commentId/replay', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(replayComment.createCommentReplay));
router.get('/comment/:commentId/replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(_checkReplay.checkReplay), (0, _asyncHandler2.default)(replayComment.getOneReplay));
router.put('/comment/:commentId/replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(_checkReplay.checkReplay), (0, _asyncHandler2.default)(_checkReplay.checkReplayOwner), (0, _asyncHandler2.default)(replayComment.updateReplay));
router.put('/comment/:commentId/delete-replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkComment.checkComment), (0, _asyncHandler2.default)(_checkReplay.checkReplay), (0, _asyncHandler2.default)(_checkReplay.checkReplayOwnerOrAdmin), (0, _asyncHandler2.default)(replayComment.deleteReplay));
router.post('/comment/report-replay/:replayId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkReplay.checkReplay), (0, _asyncHandler2.default)(replayComment.reportReplayComment));
exports.default = router;