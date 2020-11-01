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

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _profile = require("../../controllers/profile");

var _profile2 = _interopRequireDefault(_profile);

var _validateAll = require("../../middleware/validations/validateAll");

var _multer = require("../../helpers/fileUploadConfig/multer");

var _multer2 = _interopRequireDefault(_multer);

var _checkUser = require("../../middleware/users/checkUser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const profile = new _profile2.default();

const router = _express2.default.Router();

router.post('/', _multer2.default.array('profilePhotos', 2), (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkUser.checkProfile), _validateAll.validateProfile, _validateAll.validations, (0, _asyncHandler2.default)(profile.createProfile));
router.get('/me', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(profile.getCurrentUserProfile));
router.get('/:organizerId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_checkUser.checkUserProfile), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(profile.getUserProfile));
router.put('/', _multer2.default.array('profilePhotos', 2), (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(profile.updateYourProfile));
exports.default = router;