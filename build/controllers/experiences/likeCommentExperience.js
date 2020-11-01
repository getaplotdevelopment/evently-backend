"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  LikeCommentExperience
} = _models2.default;
/**
 * @CommentExperienceController Controller
 * @exports
 * @class
 */

class LikeExperienceCommentController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async LikeCommentExperience(req, res) {
    const {
      commentId: commentExperience
    } = req.params;
    const {
      id: user
    } = req.user;
    const where = {
      commentExperience,
      user
    };
    const findLikedComment = await LikeCommentExperience.findOne({
      where
    });

    if (!findLikedComment) {
      await LikeCommentExperience.create({
        commentExperience,
        user,
        hasLiked: true
      });
      return res.status(201).json({
        status: 201,
        message: 'Experience comment liked successfully'
      });
    }

    await LikeCommentExperience.update({
      commentExperience,
      user,
      hasLiked: !findLikedComment.hasLiked
    }, {
      where
    });
    return res.status(200).json({
      status: 200,
      message: findLikedComment.hasLiked ? 'Experience comment unliked successfully' : 'Experience comment liked successfully'
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */


  async dislikeCommentExperience(req, res) {
    const {
      commentId: commentExperience
    } = req.params;
    const {
      id: user
    } = req.user;
    const where = {
      commentExperience,
      user
    };
    const findLikedComment = await LikeCommentExperience.findOne({
      where
    });

    if (!findLikedComment) {
      await LikeCommentExperience.create({
        commentExperience,
        user,
        hasDisliked: true
      });
      return res.status(201).json({
        status: 201,
        message: 'Experience comment disliked successfully'
      });
    }

    await LikeCommentExperience.update({
      commentExperience,
      user,
      hasDisliked: !findLikedComment.hasDisliked
    }, {
      where
    });
    return res.status(200).json({
      status: 200,
      message: findLikedComment.hasDisliked ? 'Experience comment undisliked successfully' : 'Experience comment disliked successfully'
    });
  }

}

exports.default = LikeExperienceCommentController;