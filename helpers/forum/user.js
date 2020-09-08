import models from '../../models/index';

const { Forum } = models;

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

export { userJoin, getRoomUsers };
