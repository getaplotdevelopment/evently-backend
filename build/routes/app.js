"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _swaggerUiExpress = require("swagger-ui-express");

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _swagger = require("../config/swagger.json");

var _swagger2 = _interopRequireDefault(_swagger);

var _users = require("./api/users");

var _users2 = _interopRequireDefault(_users);

var _socialAuth = require("./api/socialAuth");

var _socialAuth2 = _interopRequireDefault(_socialAuth);

var _event = require("./api/event");

var _event2 = _interopRequireDefault(_event);

var _payments = require("./api/payments");

var _payments2 = _interopRequireDefault(_payments);

var _profile = require("./api/profile");

var _profile2 = _interopRequireDefault(_profile);

var _roles = require("./api/roles");

var _roles2 = _interopRequireDefault(_roles);

var _ticketCategory = require("./api/ticketCategory");

var _ticketCategory2 = _interopRequireDefault(_ticketCategory);

var _ticket = require("./api/ticket");

var _ticket2 = _interopRequireDefault(_ticket);

var _feedback = require("./api/feedback");

var _feedback2 = _interopRequireDefault(_feedback);

var _featuredEvent = require("./api/featuredEvent");

var _featuredEvent2 = _interopRequireDefault(_featuredEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.use('/api', _featuredEvent2.default);
app.use('/api', _event2.default);
app.use('/api/payments', _payments2.default);
app.use('/api/users', [_users2.default, _socialAuth2.default]);
app.use('/api/profile', _profile2.default);
app.use('/api/roles', _roles2.default);
app.use('/api/ticket/category', _ticketCategory2.default);
app.use('/api/ticket', _ticket2.default);
app.use('/api/feedback', _feedback2.default);
app.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swagger2.default));
app.get('/redirect', (req, res) => {
  res.sendfile('views/index.html');
});
exports.default = app;