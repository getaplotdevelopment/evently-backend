import models from '../../models';

const { LikeCommentExperience } = models;

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
    const { commentId: commentExperience } = req.params;
    const { id: user } = req.user;
    const where = { commentExperience, user };
    const condition2 = { commentExperience, user, hasLiked: false };

    const findLikedComment = await LikeCommentExperience.findOne({ where });
    const findDisLikeComment = await LikeCommentExperience.findOne({
      where: condition2
    });
    if (findDisLikeComment) {
      await LikeCommentExperience.update(
        { commentExperience, user, hasLiked: true },
        { where }
      );
      return res.status(200).json({
        status: 200,
        message: 'Comment liked successfully'
      });
    }
    if (!findLikedComment) {
      await LikeCommentExperience.create({
        commentExperience,
        user,
        hasLiked: true
      });
      return res.status(200).json({
        status: 200,
        message: 'Comment liked successfully'
      });
    }
    await LikeCommentExperience.update(
      { commentExperience, user, hasLiked: false },
      { where }
    );
    return res.status(200).json({
      status: 200,
      message: 'Comment disliked successfully'
    });
  }
}
export default LikeExperienceCommentController;
