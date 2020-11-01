"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoomUsers = exports.userJoin = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Forum
} = _index2.default;

const userJoin = async (socketId, connectedUser) => {
  const user = {
    clientId: socketId,
    connectedUser
  };
  const userForum = await Forum.create(user);
  return userForum;
};

const getRoomUsers = forumUsers => {
  return forumUsers.filter(forumUser => forumUser.user);
};

exports.userJoin = userJoin;
exports.getRoomUsers = getRoomUsers;