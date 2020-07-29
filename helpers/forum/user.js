import models from '../../models/index';

const { Forum } = models;

const userJoin = async (socketId, username) => {
  const user = {
    id: socketId,
    username
  };
  await Forum.create(user);
};

export { userJoin };
