"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _isAdminAuth = require("../../middleware/users/isAdminAuth");

var _isAdminAuth2 = _interopRequireDefault(_isAdminAuth);

var _report = require("../../controllers/report");

var _report2 = _interopRequireDefault(_report);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const report = new _report2.default();

const router = _express2.default.Router();

router.get('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(report.getAllReport));
exports.default = router;