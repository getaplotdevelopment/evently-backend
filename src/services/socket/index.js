import socketIo from 'socket.io';

import {
  CONNECTION,
  DISCONNECT,
  CONNECT_USER,
  CONNECT_USER_SUCCESS
} from '../../constants/forum/general';
import ConnectedUser from '../../controllers/forum/connedtedUser';
import forum from './forum';

const disconnectUser = async socket => {
  const { user } = socket;
  if (socket.user) {
    await ConnectedUser.remove({
      clientId: socket.id,
      userName: user.userName
    });
  }
};

const connectUser = user => async socket => {
  socket.user = user;
  const data = {
    userName: user.userName,
    clientId: socket.id
  };
  const response = await ConnectedUser.add(data);
  return socket.emit(CONNECT_USER_SUCCESS, response);
};

export default server => {
  const io = socketIo(server);
  io.on(CONNECTION, socket => {
    socket.on(CONNECT_USER, async user => connectUser(user)(socket));
    socket.on(DISCONNECT, async () => disconnectUser(socket));
  });
  io.forumNsp = forum(io);
};
