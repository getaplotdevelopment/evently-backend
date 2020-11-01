"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _event = require("../../controllers/event");

var _checkEvent = require("../../middleware/event/checkEvent");

var _payments = require("../../controllers/payments");

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

var _validateAll = require("../../middleware/validations/validateAll");

var _authUser = require("../../middleware/users/authUser");

var _authUser2 = _interopRequireDefault(_authUser);

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _ticket = require("../../middleware/tickets/ticket");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

const upload = (0, _multer2.default)();
router.post('/events', upload.single('eventImage'), (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), _validateAll.validateEvent, _validateAll.validations, (0, _asyncHandler2.default)(_event.createEventController));
router.get('/events', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), (0, _asyncHandler2.default)(_event.getOrganizerEvents));
router.get('/events/all', (0, _asyncHandler2.default)(_event.getAllEvents));
router.get('/events/userlocation', (0, _asyncHandler2.default)(_event.getUserLocationEvents));
router.patch('/events/:slug', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_authUser2.default), (0, _asyncHandler2.default)(_event.updateEvents));
router.patch('/events/:slug/like', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_event.likeUnlikeEvent));
router.get('/events/liked', (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_event.likedEvent));
router.get('/events/:slug/similar', (0, _asyncHandler2.default)(_event.getSimilarEvents));
router.get('/events/:slug/nearbycity', (0, _asyncHandler2.default)(_event.getEventsNearCities));
router.get('/events/:slug/users', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_payments.usersPaidForEvent));
router.get('/events/:slug/attend', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_payments.eventAttendees));
router.get('/events/:slug', (0, _asyncHandler2.default)(_event.singleEvent));
router.get('/category/events/:slug', (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_event.eventTicketCategory));
router.get('/events/:slug/tickets', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_event.getUserEventTickets));
router.get('/events/:slug/tickets/:ticketId', (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_ticket.checkPaidEventTicket), (0, _asyncHandler2.default)(_event.getSingleUserTicket));
exports.default = router;