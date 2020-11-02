import { Op } from 'sequelize';
import models from '../models/index';

const { TicketCategory, User } = models;

/**
 * @ticketCategory controller
 * @exports
 * @class
 */
class TicketCategoryController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createTicketCategory(req, res) {
    const { designation } = req.body;

    const { id, role } = req.user;
    const isDefault = role === 3;

    const newTicketCategory = {
      designation,
      isDefault,
      user: id
    };

    const createdTicketCategory = await TicketCategory.create(
      newTicketCategory
    );

    const user = await User.findOne({ where: { id } });

    const category = {
      id: createdTicketCategory.id,
      isDefault: createdTicketCategory.isDefault,
      designation: createdTicketCategory.designation,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        avatar: user.avatar
      }
    };
    res.status(201).json({ status: 201, category });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllTicketCategory(req, res) {
    const { id } = req.user;
    const ticketCategory = await TicketCategory.findAll({
      where: { [Op.or]: [{ user: id }, { isDefault: true }] }
    });
    res.status(200).json({ status: 200, ticketCategory });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneTicketCategory(req, res) {
    const { ticketCategoryId } = req.params;
    const ticketCategory = await TicketCategory.findOne({
      where: { id: ticketCategoryId }
    });
    res.status(200).json({ status: 200, ticketCategory });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateTicketCategory(req, res) {
    const { ticketCategoryId } = req.params;
    const { designation } = req.body;
    const updateTicketCategory = {
      designation
    };
    const updatedTicketCategory = await TicketCategory.update(
      updateTicketCategory,
      {
        where: { id: ticketCategoryId }
      }
    );
    res.status(200).json({ status: 200, updateTicketCategory });
  }
}

export default TicketCategoryController;
