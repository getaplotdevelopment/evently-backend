import models from '../models/index';

const { TicketCategory } = models;

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
    const newTicketCategory = {
      designation
    };

    const createdTicketCategory = await TicketCategory.create(
      newTicketCategory
    );
    res.status(201).json({ status: 201, createdTicketCategory });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllTicketCategory(req, res) {
    const ticketCategory = await TicketCategory.findAll({});
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
