"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _users = require("../../controllers/users");

var _users2 = _interopRequireDefault(_users);

var _authentication = require("../../middleware/socialAuth/authentication");

var _authentication2 = _interopRequireDefault(_authentication);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const socialAuthStrategy = new _authentication2.default();
const user = new _users2.default();

const router = _express2.default.Router();

router.get('/login/facebook', _passport2.default.authenticate('facebook')); // router.get('/facebook/redirect', passport.authenticate('facebook', user.loginViaSocialMedia));

router.get('/login/facebook/redirect', _passport2.default.authenticate('facebook', {
  session: false,
  failureRedirect: '/facebook'
}), (0, _asyncHandler2.default)(user.loginViaSocialMedia));
router.get('/login/google', _passport2.default.authenticate('google', {
  scope: ['profile']
}));
router.get('/login/google/redirect', _passport2.default.authenticate('google', {
  session: false
}), (0, _asyncHandler2.default)(user.loginViaSocialMedia));
router.post('/auth/google', user.socialAuthentication);
router.post('/auth/facebook', user.socialAuthentication);
exports.default = router;