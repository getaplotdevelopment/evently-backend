import models from '../models/index';

const { Ticket, TicketCategory, User, Event } = models;

/**
 * @ticket controller
 * @exports
 * @class
 */
class TicketController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createTicket(req, res) {
    const { slug } = req.params;
    const { price, category } = req.body;
    const createdTicketSummary = [];
    const { id } = req.organizer;
    const availableTickets = [];

    const allTickets = await TicketCategory.findAll({});

    allTickets.forEach(item => {
      availableTickets.push({
        name: item.designation.toUpperCase(),
        id: item.id
      });
    });

    const createTicketsByCategory = async (category, number, price) => {
      const newTicket = {
        price,
        category,
        organizer: id,
        event: slug,
        status: 'available'
      };

      let count = await Ticket.count({ organizer: id, event: slug });

      for (let i = 1; i <= number; i++) {
        count += 1;
        newTicket.ticketNumber = count;
        const createdTicket = await Ticket.create(newTicket);
      }
    };

    const categoryMapper = category => {
      return availableTickets.find(({ name }) => name === category);
    };

    for (const ticket in category[0]) {
      const ticketsPerCategory = category[0][ticket];
      const availableCategory = await categoryMapper(ticket.toUpperCase());
      if (availableCategory) {
        const ticketPrice = price[0][ticket];
        await createTicketsByCategory(
          availableCategory.id,
          ticketsPerCategory,
          ticketPrice
        );
        const summary = {
          category: availableCategory.name,
          tickets: ticketsPerCategory,
          price: ticketPrice
        };
        createdTicketSummary.push(summary);
      }
    }

    if (createdTicketSummary.length == 0) {
      return res.status(404).json({
        status: 404,
        message: 'No tickets created, Ticket category does not exist.',
        createdTicketSummary
      });
    }
    res
      .status(201)
      .json({ status: 201, message: 'success', createdTicketSummary });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllTicket(req, res) {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: 'user',
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
          model: Event,
          as: 'events',
          attributes: {
            exclude: [
              'category',
              'numberDays',
              'startTime',
              'startDate',
              'finishDate',
              'eventType',
              'favorited',
              'favoritedCount',
              'eventImage',
              'currentMode',
              'createdAt',
              'updatedAt',
              'isLiked',
              'isDeleted'
            ]
          }
        },
        {
          model: TicketCategory,
          as: 'ticketCategory',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      attributes: [
        'id',
        'price',
        'ticketNumber',
        'status',
        'createdAt',
        'updatedAt'
      ]
    });
    res.status(200).json({ status: 200, tickets });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllTicketByEvent(req, res) {
    const { slug } = req.params;
    const ticket = await Ticket.findAll({
      where: {
        event: slug
      },
      include: [
        {
          model: User,
          as: 'user',
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
          model: Event,
          as: 'events',
          attributes: {
            exclude: [
              'category',
              'numberDays',
              'startTime',
              'startDate',
              'finishDate',
              'eventType',
              'favorited',
              'favoritedCount',
              'eventImage',
              'currentMode',
              'createdAt',
              'updatedAt',
              'isLiked',
              'isDeleted'
            ]
          }
        },
        {
          model: TicketCategory,
          as: 'ticketCategory',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      attributes: [
        'id',
        'price',
        'ticketNumber',
        'status',
        'createdAt',
        'updatedAt'
      ]
    });
    res.status(200).json({ status: 200, ticket });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneTicket(req, res) {
    const { ticketId, slug } = req.params;
    const ticket = await Ticket.findOne({
      where: { ticketNumber: ticketId, event: slug },
      include: [
        {
          model: User,
          as: 'user',
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
          model: Event,
          as: 'events',
          attributes: {
            exclude: [
              'category',
              'numberDays',
              'startTime',
              'startDate',
              'finishDate',
              'eventType',
              'favorited',
              'favoritedCount',
              'eventImage',
              'currentMode',
              'createdAt',
              'updatedAt',
              'isLiked',
              'isDeleted'
            ]
          }
        },
        {
          model: TicketCategory,
          as: 'ticketCategory',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      attributes: [
        'id',
        'price',
        'ticketNumber',
        'status',
        'createdAt',
        'updatedAt'
      ]
    });
    res.status(200).json({ status: 200, ticket });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateTicket(req, res) {
    const { id } = req.organizer;
    const { ticketId, slug } = req.params;
    const { price, status, category } = req.body;
    const updateTicket = {
      price,
      status,
      category,
      organizer: id,
      event: slug
    };

    const updatedTicket = await Ticket.update(updateTicket, {
      where: { ticketNumber: ticketId, event: slug }
    });
    res.status(200).json({ status: 200, updateTicket });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateTicketsByCategoty(req, res) {
    const { id } = req.organizer;
    const { slug } = req.params;
    const { price, status } = req.body;
    const availableTickets = [];

    const allTickets = await TicketCategory.findAll({});

    allTickets.forEach(item => {
      availableTickets.push({
        name: item.designation.toUpperCase(),
        id: item.id
      });
    });

    const updateTicketsByCategory = async (category, price, status) => {
      const updateTicket = {
        price,
        organizer: id,
        event: slug,
        status
      };

      const updatedTicket = await Ticket.update(updateTicket, {
        where: { category, event: slug }
      });
    };

    const categoryMapper = category => {
      return availableTickets.find(({ name }) => name === category);
    };
    const updatedSummary = [];

    if (price.length !== 0) {
      for (const ticket in price[0]) {
        const ticketPrice = price[0][ticket];
        const availableCategory = await categoryMapper(ticket.toUpperCase());
        if (availableCategory) {
          await updateTicketsByCategory(availableCategory.id, ticketPrice);
          const summary = {};
          summary.ticket = availableCategory.name;
          summary.price = ticketPrice;
          updatedSummary.push(summary);
        }
      }
    }

    if (status.length !== 0) {
      for (const ticket in status[0]) {
        const newStatus = status[0][ticket];
        const availableCategory = await categoryMapper(ticket.toUpperCase());
        if (availableCategory) {
          await updateTicketsByCategory(
            availableCategory.id,
            undefined,
            newStatus
          );
          const summary = {};
          summary.ticket = availableCategory.name;
          summary.status = newStatus;
          updatedSummary.push(summary);
        }
      }
    }
    res
      .status(200)
      .json({ status: 200, message: 'updated successfully', updatedSummary });
  }
}

export default TicketController;
