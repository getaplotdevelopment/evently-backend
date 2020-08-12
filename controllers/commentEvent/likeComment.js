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
    const condition2 = { commentEvent, user, hasLiked: false };

    const findLikedComment = await likeComment.findOne({ where });
    const findDislikeComment = await likeComment.findOne({ where: condition2 });
    if (findDislikeComment) {
      await likeComment.update(
        { commentEvent, user, hasLiked: true },
        { where }
      );
      return res.status(200).json({
        status: 200,
        message: 'liked successfully'
      });
    }
    if (!findLikedComment) {
      await likeComment.create({ commentEvent, user, hasLiked: true });
      return res.status(200).json({
        status: 200,
        message: 'liked successfully'
      });
    }
    await likeComment.update(
      { commentEvent, user, hasLiked: false },
      { where }
    );
    return res.status(200).json({
      status: 200,
      message: 'Disliked successfully'
    });
  }
}
export default LikeCommentController;
