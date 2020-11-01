"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _authUser = require("../../middleware/users/authUser");

var _authUser2 = _interopRequireDefault(_authUser);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _ticket = require("../../controllers/ticket");

var _ticket2 = _interopRequireDefault(_ticket);

var _validateAll = require("../../middleware/validations/validateAll");

var _checkEvent = require("../../middleware/event/checkEvent");

var _ticket3 = require("../../middleware/tickets/ticket");

var _event = require("../../controllers/event");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  createTicket,
  getAllTicket,
  getAllTicketByEvent,
  getOneTicket,
  updateTicket,
  updateTicketsByCategory
} = new _ticket2.default();

const router = _express2.default.Router();

router.post('/:slug', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), // asyncHandler(checkTicketExist),
_validateAll.validateTicket, _validateAll.validations, (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(createTicket));
router.get('/', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(getAllTicket));
router.get('/upcoming', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_event.upcomingEventTickets));
router.get('/past', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_event.pastEventTickets));
router.get('/:slug', (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(getAllTicketByEvent));
router.get('/:slug/:ticketId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket3.checkTicket), (0, _asyncHandler2.default)(getOneTicket));
router.put('/:slug/:ticketId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket3.checkTicket), (0, _asyncHandler2.default)(_ticket3.checkAccessTicket), (0, _asyncHandler2.default)(updateTicket));
router.put('/:slug/', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket3.checkAccessTicket), (0, _asyncHandler2.default)(updateTicketsByCategory));
exports.default = router;