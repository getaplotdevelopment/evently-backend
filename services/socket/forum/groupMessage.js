import { Namespace } from 'socket.io';

import {
  JOIN_ROOM_FORUM,
  MESSAGE_CHAT_FORUM,
  GET_ROOM_USERS,
  GET_FEEDBACK_FORUM
} from '../../../constants/forum/groupMessage';
import GroupForumController from '../../../controllers/forum/groupeForum';

export default async ({ io, forumNsp, socket }) => {
  socket.on(JOIN_ROOM_FORUM, connectedUser => {
    return GroupForumController.joinForum(socket, connectedUser);
  });
};
