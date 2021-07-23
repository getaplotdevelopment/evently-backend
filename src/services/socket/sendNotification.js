import Models from '../../models';

const { Notification } = Models;

const sendNotification = async (receiverId, title, body, to) => {
  await Notification.create({
    is_read: false,
    title,
    body,
    to: to || 'normal',
    receiverId
  });
};
export default sendNotification;
