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

var _roles = require("../../controllers/roles");

var _roles2 = _interopRequireDefault(_roles);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _validateAll = require("../../middleware/validations/validateAll");

var _checkRole = require("../../middleware/roles/checkRole");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const roles = new _roles2.default();

const router = _express2.default.Router();

router.post('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), _validateAll.validateRole, _validateAll.validations, (0, _asyncHandler2.default)(_checkRole.checkRoleDesignation), (0, _asyncHandler2.default)(roles.createRole));
router.get('/', (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(roles.getAllRoles));
router.get('/:roleId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), (0, _asyncHandler2.default)(_checkRole.checkRole), (0, _asyncHandler2.default)(roles.getOneRole));
router.put('/:roleId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_isAdminAuth2.default), _validateAll.validateRole, _validateAll.validations, (0, _asyncHandler2.default)(_checkRole.checkRole), (0, _asyncHandler2.default)(roles.updateRole));
exports.default = router;