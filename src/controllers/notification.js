import { Op } from 'sequelize';
import models from '../models/index';
import sendNotification from '../services/socket/sendNotification';
import emitter from '../services/socket/eventEmmiter';

const { Notification, User } = models;

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

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */

  async notifyAll(req, res) {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Please enter title and body' });
    }
    const users = await User.findAll({
      where: {
        role: { [Op.ne]: 'SUPER USER' }
      }
    });
    users.forEach(user => {
      (async () => {
        await sendNotification(user.dataValues.id, title, body);
        emitter.emit('new notification', '');
      })();
    });

    res
      .status(201)
      .json({ status: 200, message: 'successfully notified all users' });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */

  async notifyUsersOrOrganizers(req, res) {
    const { title, body, to } = req.body;
    if (!title || !body || !to) {
      return res
        .status(400)
        .json({ message: 'Please enter title and body and receivers' });
    }

    const users = await User.findAll({
      where: {
        role: to
      }
    });
    if (!users.length) {
      return res
        .status(400)
        .json({ message: 'Please use valid role on to, USER or ORGANIZER' });
    }
    users.forEach(user => {
      (async () => {
        await sendNotification(user.dataValues.id, title, body);
        emitter.emit('new notification', '');
      })();
    });

    res
      .status(201)
      .json({ status: 200, message: 'successfully notified all users' });
  }
}

export default NotificationsController;
