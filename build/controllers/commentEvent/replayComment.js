"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _reports = require("../../constants/reports");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-dupe-keys */
const {
  User,
  commentEvent,
  replayComment,
  ReportContent
} = _models2.default;

const includeUser = () => {
  return [{
    model: User,
    as: 'owner',
    attributes: {
      exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
    }
  }];
};

const includeComment = () => {
  return [{
    model: commentEvent,
    as: 'commentEvents',
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: includeUser()
  }];
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
    const {
      commentId
    } = req.params;
    const {
      text,
      img,
      isHidden
    } = req.body;
    const {
      id: user
    } = req.user;
    const replayToComment = {
      text,
      img,
      isHidden,
      user,
      commentEvent: commentId
    };
    const newReplay = await replayComment.create(replayToComment);
    const replay = { ...newReplay.dataValues,
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
      replay
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */


  async getOneReplay(req, res) {
    const {
      replayId: id,
      commentId
    } = req.params;
    const where = {
      id,
      isDeleted: false,
      commentEvent: commentId
    };
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
    const {
      replayId: id,
      commentId
    } = req.params;
    const {
      text,
      img,
      isHidden
    } = req.body;
    const where = {
      id,
      isDeleted: false,
      commentEvent: commentId
    };
    const newReplay = {
      text,
      img,
      isHidden
    };
    const updateReplay = await replayComment.update(newReplay, {
      where
    });

    if (updateReplay[0] === 0) {
      res.status(404).json({
        status: 404,
        message: 'Repaly not found'
      });
    }

    const replay = { ...newReplay,
      user: {
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          userName: req.user.userName,
          email: req.user.email,
          avatar: req.user.avtar,
          phoneNumber: req.user.phoneNumber
        }
      }
    };

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
    const {
      replayId: id,
      commentId
    } = req.params;
    const where = {
      id,
      commentEvent: commentId
    };
    const repaly = {
      isDeleted: true
    };
    const [updatedRow, [updatedReplay]] = await replayComment.update(repaly, {
      where,
      returning: true
    });
    const {
      dataValues: {
        isDeleted
      }
    } = updatedReplay;

    if (updatedRow === 0) {
      res.status(200).json({
        status: 200,
        message: 'Replay not found'
      });
    }

    if (updatedRow === 1) {
      res.status(200).json({
        status: 200,
        message: isDeleted ? 'Replay already deleted' : 'Replay successfully deleted'
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
    const {
      replayId: entityId
    } = req.params;
    const {
      designation
    } = req.body;
    const {
      id: user
    } = req.user;
    const newReport = {
      entity: _reports.REPLAY_EVENT_COMMENT,
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

exports.default = ReplayCommentController;