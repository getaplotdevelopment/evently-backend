import models from '../../models';
import { EVENT_COMMENT } from '../../constants/reports';

const { User, commentEvent, Event, ReportContent } = models;

const includeUser = () => {
  return [
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
  ];
};

/**
 * @CommentEventController Controller
 * @exports
 * @class
 */
class CommentEventController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createComment(req, res) {
    const { slug } = req.params;
    const { text, img, isHidden } = req.body;
    const { id: user } = req.user;
    const comment = {
      text,
      img,
      isHidden,
      user,
      event: slug
    };
    const newComment = await commentEvent.create(comment);
    res.status(201).json({
      status: 201,
      comment: newComment
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneComment(req, res) {
    const { commentId, slug } = req.params;
    const where = { id: commentId, isDeleted: false, event: slug };
    const comment = await commentEvent.findOne({
      where,
      include: includeUser()
    });
    if (!comment) {
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
    res.status(200).json({
      status: 200,
      comment
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateComment(req, res) {
    const { commentId: id, slug } = req.params;
    const { text, img, isHidden } = req.body;
    const where = { id, isDeleted: false, event: slug };
    const comment = {
      text,
      img,
      isHidden
    };
    const updateComment = await commentEvent.update(comment, {
      where
    });
    console.log('updateComment', updateComment);
    if (updateComment[0] === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
    if (updateComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'event successfully updated',
        comment
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async deleteComment(req, res) {
    const { commentId: id, slug } = req.params;
    const where = { id };
    const comment = {
      isDeleted: true,
      event: slug
    };
    const deleteComment = await commentEvent.update(comment, {
      where
    });
    if (deleteComment[0] === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
    if (deleteComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Comment successfully deleted'
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async reportCommentEvent(req, res) {
    const { commentId: entityId } = req.params;
    const { designation } = req.body;
    const { id: user } = req.user;
    const newReport = {
      entity: EVENT_COMMENT,
      designation,
      entityId,
      user
    };
    const reportExperience = await ReportContent.create(newReport);
    res.status(201).json({
      status: 200,
      reportExperience,
      message: 'Thanks for your report'
    });
  }
}

export default CommentEventController;