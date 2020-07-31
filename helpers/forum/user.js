import models from '../../models/index';

const { Forum } = models;

const userJoin = async (socketId, connectedUser) => {
  const user = {
    clientId: socketId,
    connectedUser
  };
  await Forum.create(user);
};

export { userJoin };
