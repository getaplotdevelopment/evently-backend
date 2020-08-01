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

const { User, Forum } = models;

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

  static async joinForum(io, socket, connectedUser) {
    const idUser = parseInt(connectedUser.user.userId, 10);
    const user = await userJoin(socket.id, idUser);
    socket.join(GETPLOT_FORUM);
    // welcome current user
    socket.emit(
      MESSAGE_CHAT_FORUM,
      formatMessage(GETPLOT_BOT_NAME, 'Welcome to Getaplot forum')
    );
    const { dataValues: userForum } = user;
    const userConnected = await findOneHelper(User, {
      id: userForum.connectedUser
    });
    const { dataValues: userForm } = userConnected;
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
    const include = [
      {
        model: User,
        as: 'user',
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
    const forumUsers = await findAllInclude(Forum, include);
    const users = forumUsers.map(forumUser => {
      return forumUser.user;
    });
    console.log('users', users);
    io.to(GETPLOT_FORUM).emit(GET_ROOM_USERS, {
      room: GETPLOT_FORUM,
      users
    });
  }
}
