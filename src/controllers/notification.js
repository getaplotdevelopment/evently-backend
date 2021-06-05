import models from '../models/index';

const { Notification } = models;

/**
 * @notification controller
 * @exports
 * @class
 */
class NotificationsController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllNotifications(req, res) {
    const notifications = await Notification.findAll({
      order: [['updatedAt', 'DESC']],
      where: { receiverId: req.user.id }
    });

    if (!notifications.length) {
      res.status(400).json({
        status: 400,
        message: 'No notification yet'
      });
    }
    res.status(200).json({
      status: 200,
      message: 'successfully got all notifications',
      notifications
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async readNotifcation(req, res) {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, receiverId: req.user.id }
    });
    if (!notification) {
      res
        .status(404)
        .json({ status: 404, message: 'No notification found with that id' });
    }
    await Notification.update(
      { is_read: true },
      { where: { id: notificationId, receiverId: req.user.id } }
    );
    const readNotification = await Notification.findOne({
      where: { id: notificationId, receiverId: req.user.id }
    });
    res.status(200).json({ status: 200, readNotification });
  }
}

export default NotificationsController;
