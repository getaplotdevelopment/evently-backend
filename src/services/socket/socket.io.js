import jwt from 'jsonwebtoken';
import Models from '../../models';
import emitter from './eventEmmiter';

const io = require('socket.io')();

const { Notification } = Models;

const verifyToken = token => {
  return jwt.verify(token, process.env.jwtSecret);
};

const findNotifications = async id => {
  const notifications = await Notification.findAll({
    where: { receiverId: id, is_read: false },
    order: [['createdAt', 'DESC']]
  });
  return notifications;
};

const socketFunction = {};
socketFunction.socketStarter = server => {
  io.attach(server);
  io.on('connection', async socket => {
    const { token } = socket.handshake.query;

    const userData = verifyToken(token);
    const data = await findNotifications(userData.id);
    if (data.length) {
      socket.emit('newNotification', data);
    }

    emitter.on('new notification', async () => {
      const updated = await findNotifications(userData.id);
      if (updated.length) {
        socket.emit('newNotification', updated);
      }
    });
  });
};
export default { socketFunction, io };
