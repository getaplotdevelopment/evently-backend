import models from '../../models';

const { likeComment } = models;

/**
 * @CommentEventController Controller
 * @exports
 * @class
 */
class LikeCommentController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async likeComment(req, res) {
    const { commentId: commentEvent } = req.params;
    const { id: user } = req.user;
    const where = { commentEvent, user };

    const findLikedComment = await likeComment.findOne({ where });

    if (!findLikedComment) {
      await likeComment.create({
        commentEvent,
        user,
        hasLiked: true,
        hasDisliked: false
      });
      return res.status(201).json({
        status: 201,
        message: 'Comment liked successfully'
      });
    }
    await likeComment.update(
      {
        commentEvent,
        user,
        hasLiked: !findLikedComment.hasLiked,
        hasDisliked: false
      },
      {
        where
      }
    );
    return res.status(200).json({
      status: 200,
      message: findLikedComment.hasLiked
        ? 'Comment unliked'
        : 'Comment liked successfully'
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async dislikeComment(req, res) {
    const { commentId: commentEvent } = req.params;
    const { id: user } = req.user;
    const where = { commentEvent, user };

    const finDislikedComment = await likeComment.findOne({ where });

    if (!finDislikedComment) {
      await likeComment.create({
        commentEvent,
        user,
        hasDisliked: true,
        hasLiked: false,
      });
      return res.status(201).json({
        status: 201,
        message: 'Comment disliked successfully'
      });
    }
    await likeComment.update(
      {
        commentEvent,
        user,
        hasDisliked: !finDislikedComment.hasDisliked,
        hasLiked: false,
      },
      {
        where
      }
    );
    return res.status(200).json({
      status: 200,
      message: finDislikedComment.hasDisliked
        ? 'Comment undisliked'
        : 'Comment disliked successfully'
    });
  }
}
export default LikeCommentController;
