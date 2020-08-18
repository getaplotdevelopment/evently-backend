import models from '../../models';
import { EXPERIENCE } from '../../constants/reports';

const { User, Experience, ReportContent } = models;

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
    res.status(201).json({
      status: 201,
      experience: newExperience
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
  async updateExperience(req, res) {
    const { experienceId: id } = req.params;
    const { text, img } = req.body;
    const where = { id, isDeleted: false };
    const experience = {
      text,
      img
    };
    const updateExperience = await Experience.update(experience, {
      where
    });
    if (updateExperience[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'experience successfully updated',
        text
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
    const deleteExperience = await Experience.update(experience, {
      where
    });
    if (deleteExperience[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Experience successfully deleted'
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
