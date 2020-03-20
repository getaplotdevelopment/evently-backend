/* eslint-disable require-jsdoc */
import 'dotenv/config';
import models from '../models/index';
import cloudinary from '../helpers/fileUploadConfig/cloudinary';
import httError from '../helpers/errorsHandler/httpError';

const { Feedback } = models;

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
    const id = req.user ? req.user.id : req.organizer.id;
    const { subject, content } = req.body;
    const newFeedback = {
      subject,
      content,
      id
    };

    const { dataValues: feedback } = await Feedback.create(newFeedback);

    return res.status(201).json({ status: 201, feedback });
  }
}

export default FeedbackController;
