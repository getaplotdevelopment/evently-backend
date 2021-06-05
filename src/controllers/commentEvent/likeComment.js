import models from '../../models';
import sendNotification from '../../services/socket/sendNotification';
import emitter from '../../services/socket/eventEmmiter';

const { likeComment, commentEvent } = models;

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
    const { commentId } = req.params;
    const { id: user } = req.user;
    const where = { commentEvent: commentId, user };

    const findLikedComment = await likeComment.findOne({ where });

    if (!findLikedComment) {
      await likeComment.create({
        commentEvent: commentId,
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
        commentEvent: commentId,
        user,
        hasLiked: !findLikedComment.hasLiked,
        hasDisliked: false
      },
      {
        where
      }
    );

    if (!findLikedComment.hasLiked) {
      const comment = await commentEvent.findOne({
        where: { id: req.params.commentId }
      });
      await sendNotification(
        comment.dataValues.user,
        `${req.user.userName} liked your comment on event`
      );
      emitter.emit('new notification', '');
    }

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
    const { commentId } = req.params;
    const { id: user } = req.user;
    const where = { commentEvent: commentId, user };

    const finDislikedComment = await likeComment.findOne({ where });

    if (!finDislikedComment) {
      await likeComment.create({
        commentEvent: commentId,
        user,
        hasDisliked: true,
        hasLiked: false
      });
      return res.status(201).json({
        status: 201,
        message: 'Comment disliked successfully'
      });
    }
    await likeComment.update(
      {
        commentEvent: commentId,
        user,
        hasDisliked: !finDislikedComment.hasDisliked,
        hasLiked: false
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
