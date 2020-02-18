import models from '../models/index';

const { Roles } = models;

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
    const { designation } = req.body;
    const newRole = {
      designation
    };

    const createdRole = await Roles.create(newRole);
    res.status(201).json({ status: 201, createdRole });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllRoles(req, res) {
    const roles = await Roles.findAll({});
    res.status(200).json({ status: 200, roles });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneRole(req, res) {
    const { roleId } = req.params;
    const roles = await Roles.findOne({ where: { id: roleId } });
    res.status(200).json({ status: 200, roles });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateRole(req, res) {
    const { roleId } = req.params;
    const { designation } = req.body;
    const updateRole = {
      designation
    };

    const updatedRole = await Roles.update(updateRole, {
      where: { id: roleId }
    });
    res.status(200).json({ status: 200, updateRole });
  }
}

export default RolesController;
