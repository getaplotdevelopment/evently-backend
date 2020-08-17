import models from '../../models';

const { LikeExperience } = models;

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

    const findLikedExperience = await LikeExperience.findOne({ where });
    const findDislikeExperience = await LikeExperience.findOne({
      where: condition2
    });
    if (findDislikeExperience) {
      await LikeExperience.update(
        { experience, user, hasLiked: true },
        { where }
      );
      return res.status(200).json({
        status: 200,
        message: 'Experience liked successfully'
      });
    }
    if (!findLikedExperience) {
      await LikeExperience.create({ experience, user, hasLiked: true });
      return res.status(200).json({
        status: 200,
        message: 'Experience liked successfully'
      });
    }
    await LikeExperience.update(
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
