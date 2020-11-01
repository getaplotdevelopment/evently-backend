"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _event = require("./event");

var _event2 = _interopRequireDefault(_event);

var _users = require("./users");

var _users2 = _interopRequireDefault(_users);

var _profile = require("./profile");

var _profile2 = _interopRequireDefault(_profile);

var _socialAuth = require("./socialAuth");

var _socialAuth2 = _interopRequireDefault(_socialAuth);

var _roles = require("./roles");

var _roles2 = _interopRequireDefault(_roles);

var _ticketCategory = require("./ticketCategory");

var _ticketCategory2 = _interopRequireDefault(_ticketCategory);

var _ticket = require("./ticket");

var _ticket2 = _interopRequireDefault(_ticket);

var _feedback = require("./feedback");

var _feedback2 = _interopRequireDefault(_feedback);

var _commentEvent = require("./commentEvent");

var _commentEvent2 = _interopRequireDefault(_commentEvent);

var _experience = require("./experience");

var _experience2 = _interopRequireDefault(_experience);

var _report = require("./report");

var _report2 = _interopRequireDefault(_report);

var _payments = require("./payments");

var _payments2 = _interopRequireDefault(_payments);

var _featuredEvent = require("./featuredEvent");

var _featuredEvent2 = _interopRequireDefault(_featuredEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.use('/', _featuredEvent2.default);
router.use('/', _event2.default);
router.use('/users', [_users2.default, _socialAuth2.default]);
router.use('/profile', _profile2.default);
router.use('/roles', _roles2.default);
router.use('/ticket/category', _ticketCategory2.default);
router.use('/ticket', _ticket2.default);
router.use('/feedback', _feedback2.default);
router.use('/event', _commentEvent2.default);
router.use('/experience', _experience2.default);
router.use('/report', _report2.default);
router.use('/payments', _payments2.default);
exports.default = router;