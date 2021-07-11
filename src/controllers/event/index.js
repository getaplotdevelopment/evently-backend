import axios from 'axios';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import getEvents from '../../helpers/eventHelper/getEvent';
import handleLikeUnlike from '../../helpers/eventHelper/handleLikeUnlike';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary';
import slugGenerator from '../../helpers/slugGenerator';
import {
  nearByCity,
  userLocationEvents
} from '../../helpers/googleMap/calculateEventDist';
import models from '../../models';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';
import 'dotenv/config';
import sendEmail from '../../helpers/sendEmail/callMailer';
import queryPaymentEvents from '../../helpers/queries/paymentEvent';

const { Op } = require('sequelize');

const {
  Event,
  Likes,
  Ticket,
  commentEvent,
  replayComment,
  PaymentEvents,
  User,
  TicketCategory,
  likeComment
} = models;
const { USER_LOCATION_URL } = process.env;

const includeTicket = () => {
  return [
    {
      model: Ticket,
      include: [{ model: TicketCategory, as: 'ticketCategory' }]
    },
    {
      model: commentEvent,
      include: [
        {
          model: replayComment,
          include: [
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
                  'updatedAt',
                  'redirectUrl',
                  'isDeactivated',
                  'isApproved'
                ]
              }
            }
          ]
        },
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
              'updatedAt',
              'redirectUrl',
              'isDeactivated',
              'isApproved'
            ]
          }
        },
        {
          model: likeComment,
          include: [
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
                  'updatedAt',
                  'redirectUrl',
                  'isDeactivated',
                  'isApproved'
                ]
              }
            }
          ]
        }
      ]
    },
    {
      model: Likes,
      include: [
        {
          model: User,
          as: 'likedBy',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'createdAt',
              'updatedAt',
              'redirectUrl',
              'isDeactivated',
              'isApproved'
            ]
          }
        }
      ]
    },
    {
      model: PaymentEvents,
      include: [{ model: Event, as: 'events' }]
    }
  ];
};

export const createEventController = async (req, res) => {
  const {
    title,
    description,
    tagList,
    category,
    numberDays,
    startDate,
    finishDate,
    startTime,
    currentMode,
    eventType,
    location
  } = req.body;
  const eventImage = req.file
    ? await uploadCloudinary(req.file.buffer)
    : req.body.eventImage;
  if (currentMode) {
    await eventStatuschecker(currentMode.split(','));
  }
  const {
    id,
    firstName,
    lastName,
    userName,
    email,
    avatar,
    isOrganizer
  } = req.organizer;
  const slug = slugGenerator(title);
  // const formatted_address = await geocode(location);
  const newEvent = {
    slug,
    title,
    description,
    tagList: tagList.split(','),
    category,
    numberDays,
    eventImage,
    startDate,
    finishDate,
    startTime,
    currentMode,
    eventType,
    location: JSON.parse(location),
    organizer: {
      id,
      firstName,
      lastName,
      userName,
      email,
      avatar,
      isOrganizer
    }
  };
  const data = await Event.create(newEvent);
  res.status(201).send({ status: 201, data });
};

export const getOrganizerEvents = async (req, res) => {
  const { email } = req.organizer;
  const searchParams = req.query;
  const filterBy = { 'organizer.email': email };
  const { pages, count, data } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeTicket()
  );

  res.send({ status: 200, pages, count, data });
};

export const getAllEvents = async (req, res) => {
  const searchParams = req.query;

  const filterBy = {
    title: {
      [Op.like]: `%${searchParams.keywords.toLowerCase()}%`
    }
  };
  const { pages, count, data } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeTicket()
  );
  res.send({ status: 200, pages, count, data });
};

export const getFutureEvents = async (req, res) => {
  const searchParams = req.query;
  const filterBy = {
    finishDate: { [Op.gte]: new Date().toISOString() },
    currentMode: 'published'
  };
  const { pages, count, data } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeTicket()
  );
  res.send({ status: 200, pages, count, data });
};

export const updateEvents = async (req, res) => {
  let temp;
  const { email } = req.organizer;
  const { slug } = req.params;
  const condition = { paymentMethod: 'free' };
  const updateTo = JSON.parse(JSON.stringify(req.body));
  if (updateTo.currentMode) {
    temp = await eventStatuschecker(updateTo.currentMode.split(','));
  }
  const { dataValues } = await Event.findOne({
    where: { slug }
  });
  const { organizer } = dataValues;

  if (email !== organizer.email) {
    return res.status(403).send({
      status: 403,
      message: 'Unauthorized to perform this action'
    });
  }
  const paymentEvents = await PaymentEvents.findAll({
    where: condition
  });
  const [result, [data]] = await Event.update(updateTo, {
    where: { slug },
    returning: true
  });

  paymentEvents.map(paymentEvent => {
    const {
      dataValues: { customer }
    } = paymentEvent;
    sendEmail(customer.email, undefined, temp);
  });

  res.send({
    status: 200,
    message: 'Successfully Updated',
    data
  });
};

export const likeUnlikeEvent = async (req, res) => {
  const { id: user } = req.user;
  const { slug } = req.params;
  const { data, isLiked, likedBy } = await handleLikeUnlike(user, slug);
  res.send({ status: 200, isLiked, data, likedBy });
};

export const likedEvent = async (req, res) => {
  const { email } = req.user;
  const searchParams = req.query;
  const includeModels = () => {
    return [
      {
        model: Ticket
      },
      {
        model: commentEvent,
        include: [
          {
            model: replayComment,
            include: [
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
                    'updatedAt',
                    'redirectUrl',
                    'isDeactivated',
                    'isApproved'
                  ]
                }
              }
            ]
          },
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
                'updatedAt',
                'redirectUrl',
                'isDeactivated',
                'isApproved'
              ]
            }
          }
        ]
      },
      {
        model: Likes,
        include: [
          {
            model: User,
            as: 'likedBy',
            attributes: {
              exclude: [
                'password',
                'isActivated',
                'deviceToken',
                'role',
                'createdAt',
                'updatedAt',
                'redirectUrl',
                'isDeactivated',
                'isApproved'
              ]
            },
            where: { email }
          }
        ]
      }
    ];
  };
  searchParams.sort = 'updatedAt:desc';
  const filterBy = { isLiked: true };
  const { pages, count, data: liked } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeModels()
  );
  res.send({ status: 200, pages, count, liked });
};

export const singleEvent = async (req, res) => {
  const { slug } = req.params;
  const event = await getSingleEvent(slug);
  res.send({ status: 200, event });
};

export const getSimilarEvents = async (req, res) => {
  const { slug } = req.params;
  const queryParams = req.query;
  queryParams.sort = 'updatedAt:desc';
  const event = await getSingleEvent(slug);
  const { location, category } = event;
  const filterBy = {
    category,
    'location.country': location.country,
    currentMode: 'published',
    finishDate: { [Op.gte]: new Date().toISOString() }
  };
  const { pages, count, data } = await getEvents(
    queryParams,
    filterBy,
    Event,
    includeTicket()
  );
  res.send({ status: 200, pages, count, data });
};

export const getEventsNearCities = async (req, res) => {
  const queryParams = req.query;
  queryParams.sort = 'updatedAt:desc';
  const { latitude: lat, longitude: lng } = queryParams;
  const filterBy = {
    finishDate: { [Op.gte]: new Date().toISOString() },
    currentMode: 'published'
  };
  const origins = [{ lat, lng }];
  delete queryParams.latitude;
  delete queryParams.longitude;
  const { pages, count, data } = await getEvents(
    queryParams,
    filterBy,
    Event,
    includeTicket()
  );
  const eventsNearCity = [];
  // TODO: Improve the performance. O(n) -> 0(logn)
  for (const event of data) {
    const destinations = [event.location.locations];

    const response = await nearByCity(origins, destinations);
    if (response.status) {
      event.dataValues.distance = response.distance;
      event.dataValues.duration = response.duration;
      eventsNearCity.push(event);
    }
  }
  res.send({ status: 200, data: eventsNearCity });
};

export const getUserLocationEvents = async (req, res) => {
  const searchParams = req.query;
  const { latitude: lat, longitude: lng } = searchParams;
  const filterBy = {
    finishDate: { [Op.gte]: new Date().toISOString() },
    currentMode: 'published'
  };
  delete searchParams.latitude;
  delete searchParams.longitude;
  const { pages, count, data } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeTicket()
  );
  const eventsInUsersLocation = [];
  const origins = [{ lat, lng }];
  // TODO: Improve the performance. O(n) -> 0(logn)
  for (const event of data) {
    const destinations = [event.location.locations];
    const response = await userLocationEvents(origins, destinations);
    if (response.status) {
      event.dataValues.distance = response.distance;
      event.dataValues.duration = response.duration;
      eventsInUsersLocation.push(event);
    }
  }
  if (eventsInUsersLocation.length === 0) {
    return res.send({ status: 200, pages, count, data });
  }
  res.send({
    status: 200,
    count: eventsInUsersLocation.length,
    data: eventsInUsersLocation
  });
};

export const eventTicketCategory = async (req, res) => {
  const { slug } = req.params;
  const data = await Ticket.findAll({
    include: [
      {
        model: TicketCategory,
        as: 'ticketCategory',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    ],
    attributes: ['category', 'price'],
    group: ['category', 'ticketCategory.id', 'Ticket.price'],
    where: { event: slug }
  });
  res.send({ message: 'success', status: 200, data });
};

/**
 * Fetch all event tickets for logged in user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */
export const getUserEventTickets = async (req, res) => {
  const { slug: event } = req.params;
  const { id: user } = req.user;
  const condition = {
    event,
    user
  };
  const tickets = await queryPaymentEvents(condition);
  res.status(200).json({ message: 'success', status: 200, tickets });
};

/**
 * Fetch logged in user ticket (single)
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */
export const getSingleUserTicket = async (req, res) => {
  const { event, ticketNumber: ticketNo } = req;
  const { id: user } = req.user;
  const condition = {
    event,
    user,
    ticketNo
  };
  const ticket = await queryPaymentEvents(condition);
  res.status(200).json({ message: 'success', status: 200, ticket });
};

/**
 * Fetches all future tickets for a loggedin user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */
export const upcomingEventTickets = async (req, res) => {
  const { id: user } = req.user;
  const condition = {
    '$PaymentEvents.user$': user,
    '$PaymentEvents.expireBy$': { [Op.gte]: new Date().toISOString() }
  };
  const events = await Event.findAll({
    where: condition,
    include: [
      {
        model: PaymentEvents,
        include: [
          {
            model: Event,
            as: 'events',
            required: true
          }
        ]
      }
    ]
  });
  res.status(200).json({ message: 'success', status: 200, events });
};

/**
 * Fetches all past tickets for a loggedin user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */
export const pastEventTickets = async (req, res) => {
  const { id: user } = req.user;
  const condition = {
    '$PaymentEvents.user$': user,
    '$PaymentEvents.expireBy$': { [Op.lte]: new Date().toISOString() }
  };
  const events = await Event.findAll({
    where: condition,
    include: [
      {
        model: PaymentEvents,
        include: [
          {
            model: Event,
            as: 'events',
            required: true
          }
        ]
      }
    ]
  });
  res.status(200).json({ message: 'success', status: 200, events });
};
