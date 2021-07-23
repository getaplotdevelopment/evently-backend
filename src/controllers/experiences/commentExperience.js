import models from '../../models';
import { EXPERIENCE_COMMENT } from '../../constants/reports';
import findOneHelper from '../../helpers/finOneHelper';
import sendNotification from '../../services/socket/sendNotification';
import emitter from '../../services/socket/eventEmmiter';

const {
  User,
  CommentExperience,
  ReportContent,
  ReplayExperienceComment,
  LikeCommentExperience,
  Experience
} = models;

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
    },
    {
      model: ReplayExperienceComment,
      include: [{ model: User, as: 'owner' }]
    },
    {
      model: LikeCommentExperience,
      include: [{ model: User, as: 'owner' }]
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
    const createdComment = {
      ...newComment.dataValues,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avatar,
        phoneNumber: req.user.phoneNumber
      }
    };
    const experience = await Experience.findOne({
      where: {
        id
      }
    });
    if (experience) {
      sendNotification(
        experience.dataValues.user,
        'Comment on experience',
        `${req.user.userName} commented on your experience ${experience.dataValues.text}`
      );
      emitter.emit('new notification');
    }

    res.status(201).json({
      status: 201,
      createdComment
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneComment(req, res) {
    const { commentId: id, experienceId: experience } = req.params;
    const where = { id, experience, isDeleted: false };
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
    const { commentId: id, experienceId: experience } = req.params;
    const { text, img, isHidden } = req.body;
    const where = { id, experience, isDeleted: false };
    const newComment = {
      text,
      img,
      isHidden
    };
    const updateComment = await CommentExperience.update(newComment, {
      where
    });
    if (updateComment[0] === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
    const comment = {
      ...newComment,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avtar,
        phoneNumber: req.user.phoneNumber
      }
    };
    if (updateComment[0] === 1) {
      return res.status(200).json({
        status: 200,
        message: 'Experience successfully updated',
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
    const { commentId: id, experienceId: experience } = req.params;
    const where = { id, experience };
    const comment = {
      isDeleted: true
    };
    const isCommentDeleted = await findOneHelper(CommentExperience, {
      id
    });
    const [updatedRow, [updatedComment]] = await CommentExperience.update(
      comment,
      {
        where,
        returning: true
      }
    );

    const {
      dataValues: { isDeleted }
    } = isCommentDeleted;

    if (updatedRow === 1) {
      res.status(200).json({
        status: 200,
        message: isDeleted
          ? 'Comment already deleted'
          : 'Comment successfully deleted'
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
