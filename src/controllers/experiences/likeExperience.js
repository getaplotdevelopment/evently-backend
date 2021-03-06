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

    const findLikedExperience = await LikeExperience.findOne({ where });

    if (!findLikedExperience) {
      await LikeExperience.create({
        experience,
        user,
        hasLiked: true
      });
      return res.status(201).json({
        status: 201,
        message: 'Experience liked successfully'
      });
    }
    await LikeExperience.update(
      {
        experience,
        user,
        hasLiked: !findLikedExperience.hasLiked
      },
      {
        where
      }
    );
    return res.status(200).json({
      status: 200,
      message: findLikedExperience.hasLiked
        ? 'Experience unliked successfully'
        : 'Experience liked successfully'
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async dislikeExperience(req, res) {
    const { experienceId: experience } = req.params;
    const { id: user } = req.user;
    const where = { experience, user };

    const findLikedExperience = await LikeExperience.findOne({ where });

    if (!findLikedExperience) {
      await LikeExperience.create({
        experience,
        user,
        hasDisliked: true
      });
      return res.status(201).json({
        status: 201,
        message: 'Experience disliked successfully'
      });
    }
    await LikeExperience.update(
      {
        experience,
        user,
        hasDisliked: !findLikedExperience.hasDisliked
      },
      {
        where
      }
    );
    return res.status(200).json({
      status: 200,
      message: findLikedExperience.hasDisliked
        ? 'Experience undisliked successfully'
        : 'Experience disliked successfully'
    });
  }
}
export default LikeExperienceController;
