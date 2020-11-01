"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  ReportContent,
  User
} = _index2.default;

const includeUser = () => {
  return [{
    model: User,
    as: 'owner',
    attributes: {
      exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
    }
  }];
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
    res.status(200).json({
      status: 200,
      reports
    });
  }

}

exports.default = ReportController;