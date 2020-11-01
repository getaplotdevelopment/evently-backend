"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _users = require("../../controllers/users");

var _users2 = _interopRequireDefault(_users);

var _userActivity = require("../../controllers/userActivity");

var _userActivity2 = _interopRequireDefault(_userActivity);

var _validateAll = require("../../middleware/validations/validateAll");

var _checkUser = require("../../middleware/users/checkUser");

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _isAdminAuth = require("../../middleware/users/isAdminAuth");

var _isAdminAuth2 = _interopRequireDefault(_isAdminAuth);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _canDeactivateUser = require("../../middleware/users/canDeactivateUser");

var _canDeactivateUser2 = _interopRequireDefault(_canDeactivateUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const users = new _users2.default();
const userActivity = new _userActivity2.default();

const router = _express2.default.Router();

router.post('/', [_validateAll.validateUser, _validateAll.ValidateRedirectUrl, (0, _asyncHandler2.default)(_checkUser.checkUser), _validateAll.validations], (0, _asyncHandler2.default)(users.signup));
router.post('/login', _validateAll.validateUserLogin, (0, _asyncHandler2.default)(_checkUser.checkUserLogin), _validateAll.validations, (0, _asyncHandler2.default)(_checkUser.isActivate), (0, _asyncHandler2.default)(_checkUser.isDeactivated), (0, _asyncHandler2.default)(users.login));
router.put('/reset-password/:token', (0, _asyncHandler2.default)(_checkToken2.default), _validateAll.validatePassword, _validateAll.validations, (0, _asyncHandler2.default)(users.resetPassword));
router.put('/verify/:token', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(users.activateAccount));
router.post('/check-user', _validateAll.validations, (0, _asyncHandler2.default)(users.checkUser));
router.post('/send-email', [_validateAll.ValidateRedirectUrl, _validateAll.validations], (0, _asyncHandler2.default)(users.checkEmail));
router.post('/resend-email', [_validateAll.ValidateRedirectUrl, _validateAll.validations], (0, _asyncHandler2.default)(users.resendVerificationEmail));
router.put('/change-password', _validateAll.validateChangePassword, _validateAll.validations, (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkUser.checkPassword), (0, _asyncHandler2.default)(users.changeCurrentPassword));
router.put('/deactivate-user/', (0, _asyncHandler2.default)(_canDeactivateUser2.default), (0, _asyncHandler2.default)(_checkUser.checkUserId), (0, _asyncHandler2.default)(users.deactivateUser));
router.put('/reactivate-user/', (0, _asyncHandler2.default)(_isAdminAuth2.default), // asyncHandler(deactivateUser),
(0, _asyncHandler2.default)(_checkUser.checkUserId), (0, _asyncHandler2.default)(users.reactivateUser));
router.put('/approve-organizer/', (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(_checkUser.checkUserId), (0, _asyncHandler2.default)(_checkUser.checkOrganizerId), (0, _asyncHandler2.default)(users.approveOrganizer));
router.patch('/location', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(users.updateLocation));
router.post('/:userId/follow', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkUser.checkFollowUser), (0, _asyncHandler2.default)(users.followUser));
router.delete('/:userId/unfollow', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkUser.checkFollowUser), (0, _asyncHandler2.default)(users.unfollowUser));
router.post('/logout', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(users.logout));
router.get('/user-activity/:userId', (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(userActivity.getUserActivity));
router.get('/admins', (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(users.fetchAdminList));
router.get('/organizers', (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(users.fetchOrgnizers));
exports.default = router;