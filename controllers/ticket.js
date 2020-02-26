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
    const { price, number, category } = req.body;
    const { id } = req.organizer;
    const newTicket = {
      price,
      number,
      category,
      organizer: id,
      event: slug
    };

    const createdTicket = await Ticket.create(newTicket);
    const ticketCategory = await TicketCategory.findOne({
      where: { id: category }
    });
    const currentOrganizer = await User.findOne({ where: { id } });
    const currentEvent = await Event.findOne({ where: { slug } });

    const newCategory = {
      id: ticketCategory.id,
      designation: ticketCategory.designation
    };

    const newOrganizer = {
      id: currentOrganizer.id,
      firstName: currentOrganizer.firstName,
      lastName: currentOrganizer.lastName,
      userName: currentOrganizer.userName,
      email: currentOrganizer.email,
      avatar: currentOrganizer.avatar
    };

    const newEvent = {
      slug: currentEvent.slug,
      title: currentEvent.title,
      description: currentEvent.description,
      location: currentEvent.location
    };

    const newCreatedTicket = {
      id: createdTicket.id,
      price: createdTicket.price,
      number: createdTicket.number,
      category: newCategory,
      organizer: newOrganizer,
      event: newEvent
    };
    res.status(201).json({ status: 201, newCreatedTicket });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllTicket(req, res) {
    const ticket = await Ticket.findAll({
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
      attributes: ['id', 'price', 'number', 'createdAt', 'updatedAt']
    });
    res.status(200).json({ status: 200, ticket });
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
      attributes: ['id', 'price', 'number', 'createdAt', 'updatedAt']
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
      where: { id: ticketId, event: slug },
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
      attributes: ['id', 'price', 'number', 'createdAt', 'updatedAt']
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
    const { price, number, category } = req.body;
    const updateTicket = {
      price,
      number,
      category,
      organizer: id,
      event: slug
    };

    const updatedTicket = await Ticket.update(updateTicket, {
      where: { id: ticketId, event: slug }
    });
    res.status(200).json({ status: 200, updateTicket });
  }
}

export default TicketController;
