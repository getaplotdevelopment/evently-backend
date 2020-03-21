/* eslint-disable require-jsdoc */
import 'dotenv/config';
import models from '../models/index';

const { Feedback, User } = models;

/**
 * @Feedback Controller
 * @exports
 * @class
 */

class FeedbackController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createFeedback(req, res) {
    const { id } = req.user;
    const { subject, content } = req.body;
    const newFeedback = {
      subject,
      content,
      user: id
    };

    const { dataValues } = await Feedback.create(newFeedback);
    const user = await User.findOne({ where: { id } });
    const feedback = {
      id: dataValues.id,
      subject: dataValues.subject,
      content: dataValues.content,
      user: {
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        email: user.dataValues.email,
        avatar: user.dataValues.avatar
      }
    };

    return res.status(201).json({ status: 201, feedback });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getAllFeedback(req, res) {
    const feedback = await Feedback.findAll({
      attributes: {
        exclude: ['user']
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });
    return res.status(200).json({
      status: 200,
      feedback
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getOneFeedback(req, res) {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findOne({
      where: { id: feedbackId },
      attributes: {
        exclude: ['user']
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });

    res.status(200).json({
      status: 200,
      feedback
    });
  }

  async updateFeedback(req, res) {
    const { feedbackId } = req.params;
    const { subject, content } = req.body;
    const newFeedback = {
      subject,
      content
    };

    const feedback = await Feedback.update(newFeedback, {
      where: { id: feedbackId }
    });

    res.status(200).json({
      status: 200,
      newFeedback
    });
  }
}

export default FeedbackController;
