import models from '../../models';
import { EXPERIENCE } from '../../constants/reports';
import pagination from '../../helpers/paginationHelper';

const {
  User,
  Experience,
  ReportContent,
  CommentExperience,
  ReplayExperienceComment,
  LikeExperience
} = models;

const includeUser = () => {
  return [
    {
      model: User,
      as: 'owner',
      attributes: {
        exclude: [
          'password',
          'isActivated',
          'deviceToken',
          'role',
          'createdAt',
          'updatedAt'
        ]
      }
    },
    {
      model: CommentExperience,
      include: [{ model: ReplayExperienceComment }]
    },
    {
      model: LikeExperience,
      include: [{ model: User, as: 'owner' }]
    }
  ];
};

/**
 * @ExperienceController Controller
 * @exports
 * @class
 */
class ExperienceController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createExperience(req, res) {
    const { text, img } = req.body;
    const { id: user } = req.user;
    const experience = {
      text,
      img,
      user
    };
    const newExperience = await Experience.create(experience);
    const createdExperience = {
      ...newExperience.dataValues,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avatar,
        phoneNumber: req.user.phoneNumber
      }
    };
    res.status(201).json({
      status: 201,
      createdExperience
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneExperience(req, res) {
    const { experienceId } = req.params;
    const where = { id: experienceId, isDeleted: false };
    const experience = await Experience.findOne({
      where,
      include: includeUser()
    });
    if (!experience) {
      return res.status(404).json({
        status: 404,
        message: 'No experience found'
      });
    }
    res.status(200).json({
      status: 200,
      experience
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllExperience(req, res) {
    const where = { isDeleted: false };
    const searchParams = req.query;
    const include = [
      {
        model: User,
        as: 'owner',
        attributes: {
          exclude: [
            'password',
            'isActivated',
            'deviceToken',
            'role',
            'redirectUrl',
            'isDeactivated',
            'isApproved',
            'createdAt',
            'updatedAt'
          ]
        }
      }
    ];
    const attributes = {
      exclude: ['user']
    };
    const experience = await pagination(
      searchParams,
      Experience,
      attributes,
      include,
      where
    );
    return res.status(200).json({
      status: 200,
      experience
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateExperience(req, res) {
    const { experienceId: id } = req.params;
    const { text, img } = req.body;
    const where = { id, isDeleted: false };
    const newExperience = {
      text,
      img
    };
    const updateExperience = await Experience.update(newExperience, {
      where
    });
    if (updateExperience[0] === 0) {
      return res.status(404).json({
        status: 404,
        message: 'experience not found'
      });
    }

    const experience = {
      ...newExperience,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        email: req.user.email,
        avatar: req.user.avtar,
        phoneNumber: req.user.phoneNumber
      }
    };

    if (updateExperience[0] === 1) {
      return res.status(200).json({
        status: 200,
        message: 'experience successfully updated',
        experience
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async deleteExperience(req, res) {
    const { experienceId: id } = req.params;
    const where = { id };
    const experience = {
      isDeleted: true
    };
    const [updatedRow, [updatedExperience]] = await Experience.update(
      experience,
      {
        where,
        returning: true
      }
    );
    const {
      dataValues: { isDeleted }
    } = updatedExperience;

    if (updatedRow === 1) {
      res.status(200).json({
        status: 200,
        message: isDeleted
          ? 'Experience already deleted'
          : 'Experience successfully deleted'
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async reportExperience(req, res) {
    const { experienceId: entityId } = req.params;
    const { designation } = req.body;
    const { id: user } = req.user;
    const newReport = {
      entity: EXPERIENCE,
      designation,
      entityId,
      user
    };
    const reportExperience = await ReportContent.create(newReport);
    res.status(201).json({
      status: 200,
      reportExperience,
      message: 'Thanks for your report'
    });
  }
}

export default ExperienceController;
