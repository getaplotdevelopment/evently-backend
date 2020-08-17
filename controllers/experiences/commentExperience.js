import models from '../../models';
import { EXPERIENCE_COMMENT } from '../../constants/reports';

const { User, CommentExperience, ReportContent } = models;

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
 * @CommentExperienceController Controller
 * @exports
 * @class
 */
class CommentExperienceController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createComment(req, res) {
    const { experienceId: id } = req.params;
    const { text, img, isHidden } = req.body;
    const { id: user } = req.user;
    const comment = {
      text,
      img,
      isHidden,
      user,
      experience: id
    };
    const newComment = await CommentExperience.create(comment);
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
    const { commentId } = req.params;
    const where = { id: commentId, isDeleted: false };
    const comment = await CommentExperience.findOne({
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
    const { commentId: id } = req.params;
    const { text, img, isHidden } = req.body;
    const where = { id, isDeleted: false };
    const comment = {
      text,
      img,
      isHidden
    };
    const updateComment = await CommentExperience.update(comment, {
      where
    });
    if (updateComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Experience successfully updated'
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
    const { commentId: id } = req.params;
    const where = { id };
    const comment = {
      isDeleted: true
    };
    const deleteComment = await CommentExperience.update(comment, {
      where
    });
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
  async reportCommentExperience(req, res) {
    const { commentId: entityId } = req.params;
    const { designation } = req.body;
    const { id: user } = req.user;
    const newReport = {
      entity: EXPERIENCE_COMMENT,
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

export default CommentExperienceController;
