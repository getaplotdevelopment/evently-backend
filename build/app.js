"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports.app = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _swaggerUiExpress = require("swagger-ui-express");

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _socket = require("./services/socket");

var _socket2 = _interopRequireDefault(_socket);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const swaggerDocument = require(_path2.default.resolve('config', 'swagger.json'));

const app = (0, _express2.default)();

const server = _http2.default.createServer(app);

const io = (0, _socket2.default)(server);
app.use((0, _cors2.default)());
app.use(_passport2.default.initialize());
app.use(_express2.default.json({
  extended: false
}));
app.use((req, _, next) => {
  req.io = io;
  next();
});
app.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(swaggerDocument)); // app.use(express.static(path.join(__dirname, 'public')));

app.use(_routes2.default);
app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: 'Page not found'
  });
});
exports.app = app;
exports.server = server;