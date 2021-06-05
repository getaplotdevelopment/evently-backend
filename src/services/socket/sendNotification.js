import Models from '../../models';

const { Notification } = Models;

const sendNotification = async (receiverId, content) => {
  await Notification.create({
    is_read: false,
    content,
    receiverId
  });
};
export default sendNotification;
