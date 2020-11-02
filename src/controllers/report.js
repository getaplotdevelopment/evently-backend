import models from '../models/index';

const { ReportContent, User } = models;

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
 * @roles controller
 * @exports
 * @class
 */
class ReportController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllReport(req, res) {
    const reports = await ReportContent.findAll({
      include: includeUser()
    });
    res.status(200).json({ status: 200, reports });
  }
}

export default ReportController;
