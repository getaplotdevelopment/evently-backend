"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _validateAll = require("../../middleware/validations/validateAll");

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _isAdminAuth = require("../../middleware/users/isAdminAuth");

var _isAdminAuth2 = _interopRequireDefault(_isAdminAuth);

var _organizerOrUser = require("../../middleware/users/organizerOrUser");

var _organizerOrUser2 = _interopRequireDefault(_organizerOrUser);

var _feedback = require("../../controllers/feedback");

var _feedback2 = _interopRequireDefault(_feedback);

var _checkUser = require("../../middleware/users/checkUser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const feedback = new _feedback2.default();

const router = _express2.default.Router();

router.post('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_organizerOrUser2.default), _validateAll.validateFeedback, _validateAll.validations, (0, _asyncHandler2.default)(feedback.createFeedback));
router.get('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(feedback.getAllFeedback));
router.get('/:feedbackId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(_checkUser.checkFeedbackId), (0, _asyncHandler2.default)(feedback.getOneFeedback));
router.put('/:feedbackId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_organizerOrUser2.default), (0, _asyncHandler2.default)(_checkUser.checkFeedbackOwner), (0, _asyncHandler2.default)(_checkUser.checkFeedbackId), _validateAll.validateFeedback, _validateAll.validations, (0, _asyncHandler2.default)(feedback.updateFeedback));
exports.default = router;