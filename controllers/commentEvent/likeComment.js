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
    const { hasLiked } = req.body;
    const where = { id: commentEvent };
    const { id: user } = req.user;
    const likedComment = {
      commentEvent,
      user,
      hasLiked
    };
    const findLikedComment = await likeComment.findOne({ where });
    if (!findLikedComment) {
      await likeComment.create(likedComment);
    }
    await likeComment.update(likedComment, { where });
  }
}
export default LikeCommentController;
