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
 
    
  }
}
export default LikeCommentController;
