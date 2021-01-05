/* eslint-disable no-dupe-keys */
import models from '../../models';
import { REPLAY_EXPERIENCE_COMMENT } from '../../constants/reports';
import findOneHelper from '../../helpers/finOneHelper';

const {
  User,
  CommentExperience,
  ReplayExperienceComment,
  ReportContent
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
    }
  ];
};
const includeComment = () => {
  return [
    {
      model: CommentExperience,
      as: 'comment',
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: includeUser()
    }
  ];
};

/**
 * @ReplayCommentExperienceController Controller
 * @exports
 * @class
 */
class ReplayCommentExperienceController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createCommentReplay(req, res) {
    const { commentId: experienceComment } = req.params;
    const { text, img } = req.body;
    const { id: user } = req.user;
    const replayToComment = {
      text,
      img,
      user,
      experienceComment
    };
    const newReplay = await ReplayExperienceComment.create(replayToComment);
    const createdReplay = {
      ...newReplay.dataValues,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avatar,
        phoneNumber: req.user.phoneNumber
      }
    };
    res.status(201).json({
      status: 201,
      createdReplay
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneReplay(req, res) {
    const { replayId: id } = req.params;
    const where = { id, isDeleted: false };
    const replay = await ReplayExperienceComment.findOne({
      where,
      include: includeComment()
    });
    if (!replay) {
      return res.status(404).json({
        status: 404,
        message: 'Comment replay not found'
      });
    }
    return res.status(200).json({
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
    const { replayId: id } = req.params;
    const { text, img } = req.body;
    const where = { id, isDeleted: false };
    const newReplay = {
      text,
      img
    };
    const updateReplay = await ReplayExperienceComment.update(newReplay, {
      where
    });
    if (updateReplay[0] === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Comment replay not found'
      });
    }
    const replay = {
      ...newReplay,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avtar,
        phoneNumber: req.user.phoneNumber
      }
    };
    if (updateReplay[0] === 1) {
      return res.status(200).json({
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
    const { replayId: id } = req.params;
    const where = { id };
    const repaly = {
      isDeleted: true
    };

    const oneReplay = await findOneHelper(ReplayExperienceComment, {
      id
    });
    const [updatedRow, [updatedReplay]] = await ReplayExperienceComment.update(
      repaly,
      {
        where,
        returning: true
      }
    );

    if (updatedRow === 1) {
      res.status(200).json({
        status: 200,
        message:
          oneReplay.isDeleted === true
            ? 'Replay already deleted'
            : 'Replay successfully deleted'
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async reportReplayCommentExperience(req, res) {
    const { replayId: entityId } = req.params;
    const { designation } = req.body;
    const { id: user } = req.user;
    const newReport = {
      entity: REPLAY_EXPERIENCE_COMMENT,
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

export default ReplayCommentExperienceController;
