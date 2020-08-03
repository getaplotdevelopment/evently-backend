/* eslint-disable require-jsdoc */
import models from '../../models/index';
import {
  JOIN_ROOM_FORUM,
  MESSAGE_CHAT_FORUM,
  GET_ROOM_USERS,
  GET_FEEDBACK_FORUM
} from '../../constants/forum/groupMessage';
import { GETPLOT_BOT_NAME, GETPLOT_FORUM } from '../../constants/forum/general';
import { userJoin, getRoomUsers } from '../../helpers/forum/user';
import { formatMessage } from '../../helpers/forum/message';
import findOneHelper from '../../helpers/rolesHelper/findOneHelper';
import findAllInclude from '../../helpers/findAllInclude';
import findOneAndDelete from '../../helpers/findOneAndDelete';

const { User, Forum, Message } = models;

const includeUser = () => {
  return [
    {
      model: User,
      as: 'owner',
      attributes: {
        exclude: [
          'password',
          'isActivated',
          'deviceToken',
          'role',
          'createdAt',
          'updatedAt'
        ]
      }
    }
  ];
};

/**
 * @GroupeForumController Controller
 * @exports
 * @class
 */
export default class GroupeForumController {
  /**
   *
   * @param {Object} connectedUser -connectedUser
   * @param {Object} data -user
   * @param {Object} socket -connexion data
   * @return {Object} Response
   */

  static async joinForum({ io, socket, forumNsp, connectedUser }) {
    const idUser = parseInt(connectedUser.user.userId, 10);
    const user = await userJoin(socket.id, idUser);
    socket.join(GETPLOT_FORUM);
   
    const { dataValues: userForum } = user;
    const userConnected = await findOneHelper(User, {
      id: userForum.connectedUser
    });
    const { dataValues: userForm } = userConnected;
    // Load all conversations
    const conversations = await findAllInclude(Message, includeUser());
    conversations.map(msg => {
      const {
        dataValues: { message, owner }
      } = msg;
      socket.emit(
        MESSAGE_CHAT_FORUM,
        formatMessage(owner.dataValues.userName, message)
      );
    });

     // welcome current user
     socket.emit(
      MESSAGE_CHAT_FORUM,
      formatMessage(GETPLOT_BOT_NAME, 'Welcome to Getaplot forum')
    );
    // Broadcast when a user connects

    socket.broadcast
      .to(GETPLOT_FORUM)
      .emit(
        MESSAGE_CHAT_FORUM,
        formatMessage(
          GETPLOT_BOT_NAME,
          `${userForm.userName} has joined the forum`
        )
      );
    // send users and room info
    const forumUsers = await findAllInclude(Forum, includeUser());
    if (forumUsers) {
      const users = forumUsers.map(forumUser => {
        return forumUser.owner;
      });
      forumNsp.in(GETPLOT_FORUM).emit(GET_ROOM_USERS, {
        room: GETPLOT_FORUM,
        users
      });
    }
  }

  static async foruMessage({ io, socket, forumNsp, message }) {
    const condition = { clientId: socket.id };
    const user = await findAllInclude(Forum, includeUser(), condition);
    if (user) {
      const {
        dataValues: {
          owner: { dataValues }
        }
      } = user[0];
      const messageToPost = {
        message,
        user: dataValues.id
      };
      await Message.create(messageToPost);
      socket.join(GETPLOT_FORUM);
      forumNsp
        .in(GETPLOT_FORUM)
        .emit(MESSAGE_CHAT_FORUM, formatMessage(dataValues.userName, message));
    }
  }

  static async leaveForum({ io, socket, forumNsp, user }) {
    const condition = { clientId: socket.id };
    const userLeave = await findOneAndDelete(Forum, condition);
    if (userLeave) {
      forumNsp
        .in(GETPLOT_FORUM)
        .emit(
          MESSAGE_CHAT_FORUM,
          formatMessage(GETPLOT_FORUM, `${user} has left the forum`)
        );
    }
  }
}
