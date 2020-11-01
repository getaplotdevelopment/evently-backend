"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _payments = require("../../controllers/payments");

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _checkEvent = require("../../middleware/event/checkEvent");

var _ticket = require("../../middleware/tickets/ticket");

var _validateAll = require("../../middleware/validations/validateAll");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.post('/webhook', (0, _asyncHandler2.default)(_payments.webhookPath));
router.post('/momo', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_payments.makePayment));
router.post('/:slug/pay', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), _validateAll.validatePaidPayment, _validateAll.validations, (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket.checkTicketEvent), (0, _asyncHandler2.default)(_payments.standardPayment));
router.post('/:slug/free', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), _validateAll.validateFreePayment, _validateAll.validations, (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket.checkTicketEvent), (0, _asyncHandler2.default)(_payments.attendFree));
router.put('/:slug/:ticketId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket.checkPaidEventTicket), (0, _asyncHandler2.default)(_payments.cancelFreeAttendance));
router.post('/:slug/:ticketId/refund', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), //TODO: Only allow suoer admin to perform this operation
(0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket.checkPaidEventTicket), (0, _asyncHandler2.default)(_payments.paymentRefund));
exports.default = router;