/* eslint-disable no-dupe-keys */
import models from '../../models';
import { REPLAY_EVENT_COMMENT } from '../../constants/reports';

const { User, commentEvent, replayComment, ReportContent } = models;

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
const includeComment = () => {
  return [
    {
      model: commentEvent,
      as: 'commentEvents',
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: includeUser()
    }
  ];
};

/**
 * @ReplayCommentController Controller
 * @exports
 * @class
 */
class ReplayCommentController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createCommentReplay(req, res) {
    const { commentId } = req.params;
    const { text, img, isHidden } = req.body;
    const { id: user } = req.user;
    const replayToComment = {
      text,
      img,
      isHidden,
      user,
      commentEvent: commentId
    };
    const newReplay = await replayComment.create(replayToComment);
    res.status(201).json({
      status: 201,
      comment: newReplay
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneReplay(req, res) {
    const { replayId: id, commentId } = req.params;
    const where = { id, isDeleted: false, commentEvent: commentId };
    const replay = await replayComment.findOne({
      where,
      include: includeComment()
    });
    if (!replay) {
      return res.status(404).json({
        status: 404,
        message: 'No repaly found'
      });
    }
    res.status(200).json({
      status: 200,
      replay
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateReplay(req, res) {
    const { replayId: id, commentId } = req.params;
    const { text, img, isHidden } = req.body;
    const where = { id, isDeleted: false, commentEvent: commentId };
    const replay = {
      text,
      img,
      isHidden
    };
    const updateReplay = await replayComment.update(replay, {
      where
    });
    if (updateReplay[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Repaly successfully updated',
        replay
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async deleteReplay(req, res) {
    const { replayId: id, commentId } = req.params;
    const where = { id, commentEvent: commentId };
    const repaly = {
      isDeleted: true
    };
    const deleteComment = await replayComment.update(repaly, {
      where
    });
    if (deleteComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Replay successfully deleted'
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async reportReplayComment(req, res) {
    const { replayId: entityId } = req.params;
    const { designation } = req.body;
    const { id: user } = req.user;
    const newReport = {
      entity: REPLAY_EVENT_COMMENT,
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

export default ReplayCommentController;
