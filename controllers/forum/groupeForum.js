/* eslint-disable require-jsdoc */
import models from '../../models/index';
import {
  JOIN_ROOM_FORUM,
  MESSAGE_CHAT_FORUM,
  GET_ROOM_USERS,
  GET_FEEDBACK_FORUM
} from '../../constants/forum/groupMessage';
import { GETPLOT_BOT_NAME, GETPLOT_FORUM } from '../../constants/forum/general';
import { userJoin } from '../../helpers/forum/user';
import { formatMessage } from '../../helpers/forum/message';

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

  static async joinForum({ socket, connectedUser }) {
    await userJoin(socket.id, connectedUser);
    socket.join(GETPLOT_FORUM);
    // welcome current user
    socket.emit(
      MESSAGE_CHAT_FORUM,
      formatMessage(GETPLOT_BOT_NAME, 'Welcome to Getaplot')
    );
  }
}
