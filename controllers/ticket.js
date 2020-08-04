import models from '../models/index';
import { async } from 'rxjs/internal/scheduler/async';

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

    const createTicketsByCategory = async(category) => {
      const newTicket = {
        price,
        category,
        organizer: id,
        event: slug,
        status: 'available'
      };
  
      let count = await Ticket.count({organizer: id, event: slug});

      const ticketCategory = await TicketCategory.findOne({
        where: { id: category }
      });
  
      if (!ticketCategory) {
        return res.status(400).send({
          status: 400,
          error: "ticket category doesn't exit"
        })
      }    
      
      for (let i = 1; i <= number; i++) {
        count += 1;
        newTicket.ticketNumber = count;
        const createdTicket = await Ticket.create(newTicket);
      }
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
        message: `${number} tickets created successfully.`,
        category: newCategory,
        organizer: newOrganizer,
        event: newEvent
      };
      return newCreatedTicket
    }
    const { slug } = req.params;
    const { price, number, ...categoryList } = req.body;
    const { id } = req.organizer;

    const categoryMapper = async(category) => {
      const res = await TicketCategory.findAll({})
      
      console.log('7568768989', res);
      
      const object = [{name: 'table', id: 1}, {name: 'vip', id: 2}, {name: 'vvip', id: 3}]
      
      return object.find(({name}) => name === category);
      
    };
    
    for (const category in categoryList) {
      const number = categoryList[category]
      const categoryId = await categoryMapper(category)

      console.log(number, categoryId);

    }

    // const newTickets = createTicketsByCategory(category)
    // res.status(201).json({ status: 201, newTickets });
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
      attributes: ['id', 'price', 'ticketNumber', 'status', 'createdAt', 'updatedAt']
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
      attributes: ['id', 'price', 'ticketNumber', 'status', 'createdAt', 'updatedAt']
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
      attributes: ['id', 'price', 'ticketNumber', 'status', 'createdAt', 'updatedAt']
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
}

export default TicketController;
