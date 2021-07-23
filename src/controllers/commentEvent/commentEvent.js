import models from '../../models';
import { EVENT_COMMENT } from '../../constants/reports';
import sendNotification from '../../services/socket/sendNotification';
import emitter from '../../services/socket/eventEmmiter';

const { User, commentEvent, Event, ReportContent, likeComment } = models;

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
      model: likeComment,
      include: [{ model: User, as: 'owner' }]
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

    const dataValues = await Event.findOne({ where: { slug } });

    const comment = {
      text,
      img,
      isHidden,
      user,
      event: slug
    };
    const newComment = await commentEvent.create(comment);

    const createdComment = {
      ...newComment.dataValues,
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avatar,
        phoneNumber: req.user.phoneNumber
      }
    };
    Event.increment({ popularityCount: 2 }, { where: { slug } });
    if (dataValues) {
      await sendNotification(
        dataValues.organizer.id,
        'Comment on event',
        `${req.user.userName} commented on your event ${dataValues.title}`
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
    const newComment = {
      text,
      img,
      isHidden
    };
    const updateComment = await commentEvent.update(newComment, {
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
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avtar,
        phoneNumber: req.user.phoneNumber
      }
    };
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
    const { comment } = req;
    if (comment.isDeleted) {
      return res.status(200).json({
        status: 200,
        message: 'Comment already deleted',
        comment
      });
    }
    const updateObj = {
      isDeleted: true,
      event: slug
    };
    const [updatedRow, [updatedComment]] = await commentEvent.update(
      updateObj,
      {
        where: { id },
        returning: true
      }
    );
    if (updatedRow === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
    if (updatedRow === 1) {
      Event.decrement({ popularityCount: 1 }, { where: { slug } });
      res.status(200).json({
        status: 200,
        message: 'Comment successfully deleted',
        comment: updatedComment
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
