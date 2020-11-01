"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _general = require("../../constants/forum/general");

var _connedtedUser = require("../../controllers/forum/connedtedUser");

var _connedtedUser2 = _interopRequireDefault(_connedtedUser);

var _forum = require("./forum");

var _forum2 = _interopRequireDefault(_forum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const disconnectUser = async socket => {
  const {
    user
  } = socket;

  if (socket.user) {
    await _connedtedUser2.default.remove({
      clientId: socket.id,
      userName: user.userName
    });
  }
};

const connectUser = user => async socket => {
  socket.user = user;
  const data = {
    userName: user.userName,
    clientId: socket.id
  };
  const response = await _connedtedUser2.default.add(data);
  return socket.emit(_general.CONNECT_USER_SUCCESS, response);
};

exports.default = server => {
  const io = (0, _socket2.default)(server);
  io.on(_general.CONNECTION, socket => {
    socket.on(_general.CONNECT_USER, async user => connectUser(user)(socket));
    socket.on(_general.DISCONNECT, async () => disconnectUser(socket));
  });
  io.forumNsp = (0, _forum2.default)(io);
};