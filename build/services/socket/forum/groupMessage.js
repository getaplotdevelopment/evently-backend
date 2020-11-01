"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require("socket.io");

var _models = require("../../../models");

var _models2 = _interopRequireDefault(_models);

var _groupMessage = require("../../../constants/forum/groupMessage");

var _groupeForum = require("../../../controllers/forum/groupeForum");

var _groupeForum2 = _interopRequireDefault(_groupeForum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async ({
  io,
  forumNsp,
  socket
}) => {
  socket.on(_groupMessage.JOIN_ROOM_FORUM, connectedUser => {
    return _groupeForum2.default.joinForum({
      io,
      socket,
      forumNsp,
      connectedUser
    });
  });
  socket.on(_groupMessage.MESSAGE_CHAT_FORUM, async message => {
    return _groupeForum2.default.foruMessage({
      io,
      socket,
      forumNsp,
      message
    });
  });
  socket.on(_groupMessage.LEAVE_FORUM, async user => {
    return _groupeForum2.default.leaveForum({
      io,
      socket,
      forumNsp,
      user
    });
  });
  socket.on(_groupMessage.IS_TYPING, async msg => {
    return _groupeForum2.default.userTyping({
      io,
      socket,
      forumNsp,
      msg
    });
  });
};