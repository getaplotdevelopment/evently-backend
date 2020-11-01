"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _adminAndOrganizer = require("../../middleware/users/adminAndOrganizer");

var _adminAndOrganizer2 = _interopRequireDefault(_adminAndOrganizer);

var _ticketCategory = require("../../controllers/ticketCategory");

var _ticketCategory2 = _interopRequireDefault(_ticketCategory);

var _validateAll = require("../../middleware/validations/validateAll");

var _category = require("../../middleware/tickets/category");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const category = new _ticketCategory2.default();

const router = _express2.default.Router();

router.post('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_adminAndOrganizer2.default), _validateAll.validateTicketCategory, _validateAll.validations, (0, _asyncHandler2.default)(_category.checkCategoryDesignation), (0, _asyncHandler2.default)(category.createTicketCategory));
router.get('/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(category.getAllTicketCategory));
router.get('/:ticketCategoryId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_category.checkCategory), (0, _asyncHandler2.default)(category.getOneTicketCategory));
router.put('/:ticketCategoryId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_adminAndOrganizer2.default), _validateAll.validateTicketCategory, _validateAll.validations, (0, _asyncHandler2.default)(_category.checkCategory), (0, _asyncHandler2.default)(category.updateTicketCategory));
exports.default = router;