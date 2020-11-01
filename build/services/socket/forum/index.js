"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directMessage = require("./directMessage");

var _directMessage2 = _interopRequireDefault(_directMessage);

var _groupMessage = require("./groupMessage");

var _groupMessage2 = _interopRequireDefault(_groupMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = io => {
  const forumNsp = io.of('/forum');
  forumNsp.on('connection', socket => {
    (0, _groupMessage2.default)({
      io,
      forumNsp,
      socket
    }); // directMessage({ io, socket });
  });
  return forumNsp;
};