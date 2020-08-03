import { Namespace } from 'socket.io';
import models from '../../../models';

import {
  JOIN_ROOM_FORUM,
  MESSAGE_CHAT_FORUM,
  LEAVE_FORUM,
  GET_ROOM_USERS,
  GET_FEEDBACK_FORUM
} from '../../../constants/forum/groupMessage';
import GroupForumController from '../../../controllers/forum/groupeForum';

export default async ({ io, forumNsp, socket }) => {
  socket.on(JOIN_ROOM_FORUM, connectedUser => {
    return GroupForumController.joinForum({
      io,
      socket,
      forumNsp,
      connectedUser
    });
  });
  socket.on(MESSAGE_CHAT_FORUM, async message => {
    return GroupForumController.foruMessage({ io, socket, forumNsp, message });
  });
  socket.on(LEAVE_FORUM, async user => {
    return GroupForumController.leaveForum({ io, socket, forumNsp, user });
  });
};
