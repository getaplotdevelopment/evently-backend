import models from '../../models';

const { likeExperience } = models;

/**
 * @LikeExperienceController Controller
 * @exports
 * @class
 */
class LikeExperienceController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async likeExperience(req, res) {
    const { experienceId: experience } = req.params;
    const { id: user } = req.user;
    const where = { experience, user };
    const condition2 = { experience, user, hasLiked: false };

    const findLikedExperience = await likeExperience.findOne({ where });
    const findDislikeExperience = await likeExperience.findOne({
      where: condition2
    });
    if (findDislikeExperience) {
      await likeExperience.update(
        { experience, user, hasLiked: true },
        { where }
      );
      return res.status(200).json({
        status: 200,
        message: 'Experience liked successfully'
      });
    }
    if (!findLikedExperience) {
      await likeExperience.create({ experience, user, hasLiked: true });
      return res.status(200).json({
        status: 200,
        message: 'Experience liked successfully'
      });
    }
    await likeExperience.update(
      { experience, user, hasLiked: false },
      { where }
    );
    return res.status(200).json({
      status: 200,
      message: 'Experience Disliked successfully'
    });
  }
}
export default LikeExperienceController;
