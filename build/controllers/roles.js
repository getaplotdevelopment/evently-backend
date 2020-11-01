"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Roles
} = _index2.default;
/**
 * @roles controller
 * @exports
 * @class
 */

class RolesController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createRole(req, res) {
    const {
      designation
    } = req.body;
    const newRole = {
      designation
    };
    const createdRole = await Roles.create(newRole);
    res.status(201).json({
      status: 201,
      createdRole
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */


  async getAllRoles(req, res) {
    const roles = await Roles.findAll({});
    res.status(200).json({
      status: 200,
      roles
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */


  async getOneRole(req, res) {
    const {
      roleId
    } = req.params;
    const roles = await Roles.findOne({
      where: {
        id: roleId
      }
    });
    res.status(200).json({
      status: 200,
      roles
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */


  async updateRole(req, res) {
    const {
      roleId
    } = req.params;
    const {
      designation
    } = req.body;
    const updateRole = {
      designation
    };
    const updatedRole = await Roles.update(updateRole, {
      where: {
        id: roleId
      }
    });
    res.status(200).json({
      status: 200,
      updateRole
    });
  }

}

exports.default = RolesController;