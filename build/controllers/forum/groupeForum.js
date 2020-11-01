"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _groupMessage = require("../../constants/forum/groupMessage");

var _general = require("../../constants/forum/general");

var _user = require("../../helpers/forum/user");

var _message = require("../../helpers/forum/message");

var _findOneHelper = require("../../helpers/rolesHelper/findOneHelper");

var _findOneHelper2 = _interopRequireDefault(_findOneHelper);

var _findAllInclude = require("../../helpers/findAllInclude");

var _findAllInclude2 = _interopRequireDefault(_findAllInclude);

var _findOneAndDelete = require("../../helpers/findOneAndDelete");

var _findOneAndDelete2 = _interopRequireDefault(_findOneAndDelete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable require-jsdoc */
const {
  User,
  Forum,
  Message
} = _index2.default;

const includeUser = () => {
  return [{
    model: User,
    as: 'owner',
    attributes: {
      exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
    }
  }];
};
/**
 * @GroupeForumController Controller
 * @exports
 * @class
 */


class GroupeForumController {
  /**
   *
   * @param {Object} connectedUser -connectedUser
   * @param {Object} data -user
   * @param {Object} socket -connexion data
   * @return {Object} Response
   */
  static async joinForum({
    io,
    socket,
    forumNsp,
    connectedUser
  }) {
    const idUser = parseInt(connectedUser.user.userId, 10);
    const user = await (0, _user.userJoin)(socket.id, idUser);
    socket.join(_general.GETPLOT_FORUM);
    const {
      dataValues: userForum
    } = user;
    const userConnected = await (0, _findOneHelper2.default)(User, {
      id: userForum.connectedUser
    });
    const {
      dataValues: userForm
    } = userConnected; // Load all conversations

    const conversations = await (0, _findAllInclude2.default)(Message, includeUser());
    conversations.map(msg => {
      const {
        dataValues: {
          message,
          owner
        }
      } = msg;
      socket.emit(_groupMessage.MESSAGE_CHAT_FORUM, (0, _message.formatMessage)(owner.dataValues.userName, message));
    }); // welcome current user

    socket.emit(_groupMessage.MESSAGE_CHAT_FORUM, (0, _message.formatMessage)(_general.GETPLOT_BOT_NAME, 'Welcome to Getaplot forum')); // Broadcast when a user connects

    socket.broadcast.to(_general.GETPLOT_FORUM).emit(_groupMessage.MESSAGE_CHAT_FORUM, (0, _message.formatMessage)(_general.GETPLOT_BOT_NAME, `${userForm.userName} has joined the forum`)); // send users and room info

    const forumUsers = await (0, _findAllInclude2.default)(Forum, includeUser());

    if (forumUsers) {
      const users = forumUsers.map(forumUser => {
        return forumUser.owner;
      });
      forumNsp.in(_general.GETPLOT_FORUM).emit(_groupMessage.GET_ROOM_USERS, {
        room: _general.GETPLOT_FORUM,
        users
      });
    }
  }

  static async foruMessage({
    io,
    socket,
    forumNsp,
    message
  }) {
    const condition = {
      clientId: socket.id
    };
    const user = await (0, _findAllInclude2.default)(Forum, includeUser(), condition);

    if (user) {
      const {
        dataValues: {
          owner: {
            dataValues
          }
        }
      } = user[0];
      const messageToPost = {
        message,
        user: dataValues.id
      };
      await Message.create(messageToPost);
      socket.join(_general.GETPLOT_FORUM);
      forumNsp.in(_general.GETPLOT_FORUM).emit(_groupMessage.MESSAGE_CHAT_FORUM, (0, _message.formatMessage)(dataValues.userName, message));
    }
  }

  static async leaveForum({
    io,
    socket,
    forumNsp,
    user
  }) {
    const condition = {
      clientId: socket.id
    };
    const userLeave = await (0, _findOneAndDelete2.default)(Forum, condition);

    if (userLeave) {
      forumNsp.in(_general.GETPLOT_FORUM).emit(_groupMessage.MESSAGE_CHAT_FORUM, (0, _message.formatMessage)(_general.GETPLOT_FORUM, `${user} has left the forum`));
    }
  }

  static async userTyping({
    io,
    socket,
    forumNsp,
    msg
  }) {
    const condition = {
      clientId: socket.id
    };
    const typingUser = await (0, _findAllInclude2.default)(Forum, includeUser(), condition);

    if (typingUser) {
      const {
        dataValues: {
          owner: {
            dataValues: {
              userName
            }
          }
        }
      } = typingUser[0];
      socket.broadcast.to(_general.GETPLOT_FORUM).emit(_groupMessage.IS_TYPING, (0, _message.formatMessage)(userName, msg));
    }
  }

}

exports.default = GroupeForumController;