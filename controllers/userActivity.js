import models from '../models/index';

const { UserActivity, User } = models;

/**
 * @userActivity -- Controller
 * @exports
 * @class
 */
class UserActivityController {
  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getUserActivity(req, res) {
    const { userId } = req.params;
    const where = {
      userId
    };
    const include = [
      {
        model: User,
        as: 'owner',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }
    ];
    const userActivities = await UserActivity.findAll({
      where,
      include
    });
    if (!userActivities.length) {
      return res.status(200).json({
        status: 200,
        userActivities,
        userActivitiesCount: 0
      });
    }
    return res.status(200).json({
      status: 200,
      userActivities
    });
  }
}

export default UserActivityController;
