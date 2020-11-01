"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pastEventTickets = exports.upcomingEventTickets = exports.getSingleUserTicket = exports.getUserEventTickets = exports.eventTicketCategory = exports.getUserLocationEvents = exports.getEventsNearCities = exports.getSimilarEvents = exports.singleEvent = exports.likedEvent = exports.likeUnlikeEvent = exports.updateEvents = exports.getAllEvents = exports.getOrganizerEvents = exports.createEventController = undefined;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _eventStatuschecker = require("../../helpers/eventHelper/eventStatuschecker");

var _eventStatuschecker2 = _interopRequireDefault(_eventStatuschecker);

var _getEvent = require("../../helpers/eventHelper/getEvent");

var _getEvent2 = _interopRequireDefault(_getEvent);

var _handleLikeUnlike = require("../../helpers/eventHelper/handleLikeUnlike");

var _handleLikeUnlike2 = _interopRequireDefault(_handleLikeUnlike);

var _uploadCloudinary = require("../../helpers/eventHelper/uploadCloudinary");

var _uploadCloudinary2 = _interopRequireDefault(_uploadCloudinary);

var _goecode = require("../../helpers/googleMap/goecode");

var _goecode2 = _interopRequireDefault(_goecode);

var _slugGenerator = require("../../helpers/slugGenerator");

var _slugGenerator2 = _interopRequireDefault(_slugGenerator);

var _calculateEventDist = require("../../helpers/googleMap/calculateEventDist");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _getSingleEvent = require("../../helpers/eventHelper/getSingleEvent");

var _getSingleEvent2 = _interopRequireDefault(_getSingleEvent);

require("dotenv/config");

var _callMailer = require("../../helpers/sendEmail/callMailer");

var _callMailer2 = _interopRequireDefault(_callMailer);

var _paymentEvent = require("../../helpers/queries/paymentEvent");

var _paymentEvent2 = _interopRequireDefault(_paymentEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Op
} = require('sequelize');

const {
  Event,
  Likes,
  Ticket,
  commentEvent,
  replayComment,
  PaymentEvents,
  User,
  TicketCategory,
  PaymentRequests
} = _models2.default;
const {
  USER_LOCATION_URL
} = process.env;

const includeTicket = () => {
  return [{
    model: Ticket,
    include: [{
      model: TicketCategory,
      as: 'ticketCategory'
    }]
  }, {
    model: commentEvent,
    include: [{
      model: replayComment
    }]
  }, {
    model: Likes,
    include: [{
      model: User,
      as: 'likedBy',
      attributes: {
        exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
      }
    }]
  }, {
    model: PaymentEvents,
    include: [{
      model: Event,
      as: 'events'
    }]
  }];
};

const createEventController = exports.createEventController = async (req, res) => {
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
  const eventImage = req.file ? await (0, _uploadCloudinary2.default)(req.file.buffer) : req.body.eventImage;

  if (currentMode) {
    await (0, _eventStatuschecker2.default)(currentMode.split(','));
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
  const slug = (0, _slugGenerator2.default)(title);
  const formatted_address = await (0, _goecode2.default)(location);
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
    location: formatted_address,
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
  res.status(201).send({
    status: 201,
    data
  });
};

const getOrganizerEvents = exports.getOrganizerEvents = async (req, res) => {
  const {
    email
  } = req.organizer;
  const searchParams = req.query;
  const filterBy = {
    'organizer.email': email
  };
  const {
    pages,
    count,
    data
  } = await (0, _getEvent2.default)(searchParams, filterBy, Event, includeTicket());
  res.send({
    status: 200,
    pages,
    count,
    data
  });
};

const getAllEvents = exports.getAllEvents = async (req, res) => {
  const searchParams = req.query;
  const {
    pages,
    count,
    data
  } = await (0, _getEvent2.default)(searchParams, searchParams, Event, includeTicket());
  res.send({
    status: 200,
    pages,
    count,
    data
  });
};

const updateEvents = exports.updateEvents = async (req, res) => {
  let temp;
  const {
    email
  } = req.organizer;
  const {
    slug
  } = req.params;
  const condition = {
    paymentMethod: 'free'
  };
  const updateTo = JSON.parse(JSON.stringify(req.body));

  if (updateTo.currentMode) {
    temp = await (0, _eventStatuschecker2.default)(updateTo.currentMode.split(','));
  }

  const {
    dataValues
  } = await Event.findOne({
    where: {
      slug
    }
  });
  const {
    organizer
  } = dataValues;

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
    where: {
      slug
    },
    returning: true
  });
  paymentEvents.map(paymentEvent => {
    const {
      dataValues: {
        customer
      }
    } = paymentEvent;
    (0, _callMailer2.default)(customer.email, undefined, temp);
  });
  res.send({
    status: 200,
    message: 'Successfully Updated',
    data
  });
};

const likeUnlikeEvent = exports.likeUnlikeEvent = async (req, res) => {
  const {
    id: user
  } = req.user;
  const {
    slug
  } = req.params;
  const {
    data,
    isLiked,
    likedBy
  } = await (0, _handleLikeUnlike2.default)(user, slug);
  res.send({
    status: 200,
    isLiked,
    data,
    likedBy
  });
};

const likedEvent = exports.likedEvent = async (req, res) => {
  const {
    email
  } = req.user;
  const searchParams = req.query;

  const includeModels = () => {
    return [{
      model: Ticket
    }, {
      model: commentEvent,
      include: [{
        model: replayComment
      }]
    }, {
      model: Likes,
      include: [{
        model: User,
        as: 'likedBy',
        attributes: {
          exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
        },
        where: {
          email
        }
      }]
    }];
  };

  searchParams.sort = 'updatedAt:desc';
  const filterBy = {
    isLiked: true
  };
  const {
    pages,
    count,
    data: liked
  } = await (0, _getEvent2.default)(searchParams, filterBy, Event, includeModels());
  res.send({
    status: 200,
    pages,
    count,
    liked
  });
};

const singleEvent = exports.singleEvent = async (req, res) => {
  const {
    slug
  } = req.params;
  const event = await (0, _getSingleEvent2.default)(slug);
  res.send({
    status: 200,
    event
  });
};

const getSimilarEvents = exports.getSimilarEvents = async (req, res) => {
  const {
    slug
  } = req.params;
  const queryParams = req.query;
  queryParams.sort = 'updatedAt:desc';
  const event = await (0, _getSingleEvent2.default)(slug);
  const {
    location,
    category
  } = event;
  const filterBy = {
    category,
    'location.country': location.country,
    finishDate: {
      [Op.gte]: new Date().toISOString()
    }
  };
  const {
    pages,
    count,
    data
  } = await (0, _getEvent2.default)(queryParams, filterBy, Event, includeTicket());
  res.send({
    status: 200,
    pages,
    count,
    data
  });
};

const getEventsNearCities = exports.getEventsNearCities = async (req, res) => {
  const {
    slug
  } = req.params;
  const event = await (0, _getSingleEvent2.default)(slug);
  const {
    location
  } = event;
  const origins = [location.locations];

  if (origins[0].lat == 0 && origins[0].lng == 0) {
    return res.send({
      status: 200,
      data: []
    });
  }

  const queryParams = {};
  const filterBy = {
    'location.country': location.country,
    finishDate: {
      [Op.gte]: new Date().toISOString()
    }
  };
  const {
    pages,
    count,
    data
  } = await (0, _getEvent2.default)(queryParams, filterBy, Event, includeTicket());
  const eventsNearCity = []; // TODO: Improve the performance. O(n) -> 0(logn)

  for (const event of data) {
    const destinations = [event.location.locations];
    const response = await (0, _calculateEventDist.nearByCity)(origins, destinations);

    if (response.status) {
      event.dataValues.distance = response.distance;
      event.dataValues.duration = response.duration;
      eventsNearCity.push(event);
    }
  }

  res.send({
    status: 200,
    data: eventsNearCity
  });
};

const getUserLocationEvents = exports.getUserLocationEvents = async (req, res) => {
  const results = await (0, _axios2.default)({
    url: USER_LOCATION_URL,
    method: 'GET'
  });
  const {
    lat,
    lon
  } = results.data;
  const searchParams = req.query;
  const {
    pages,
    count,
    data
  } = await (0, _getEvent2.default)(searchParams, searchParams, Event, includeTicket());
  const eventsInUsersLocation = [];
  const origins = [{
    lat,
    lng: lon
  }]; // TODO: Improve the performance. O(n) -> 0(logn)

  for (const event of data) {
    const destinations = [event.location.locations];
    const response = await (0, _calculateEventDist.userLocationEvents)(origins, destinations);

    if (response.status) {
      event.dataValues.distance = response.distance;
      event.dataValues.duration = response.duration;
      eventsInUsersLocation.push(event);
    }
  }

  if (eventsInUsersLocation.length === 0) {
    return res.send({
      status: 200,
      pages,
      count,
      data
    });
  }

  res.send({
    status: 200,
    count: eventsInUsersLocation.length,
    data: eventsInUsersLocation
  });
};

const eventTicketCategory = exports.eventTicketCategory = async (req, res) => {
  const {
    slug
  } = req.params;
  const data = await Ticket.findAll({
    include: [{
      model: TicketCategory,
      as: 'ticketCategory',
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }],
    attributes: ['category'],
    group: ['category', 'ticketCategory.id'],
    where: {
      event: slug
    }
  });
  res.send({
    message: 'success',
    status: 200,
    data
  });
};
/**
 * Fetch all event tickets for logged in user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */


const getUserEventTickets = exports.getUserEventTickets = async (req, res) => {
  const {
    slug: event
  } = req.params;
  const {
    id: user
  } = req.user;
  const condition = {
    event,
    user
  };
  const tickets = await (0, _paymentEvent2.default)(condition);
  res.status(200).json({
    message: 'success',
    status: 200,
    tickets
  });
};
/**
 * Fetch logged in user ticket (single)
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */


const getSingleUserTicket = exports.getSingleUserTicket = async (req, res) => {
  const {
    event,
    ticketNumber: ticketNo
  } = req;
  const {
    id: user
  } = req.user;
  const condition = {
    event,
    user,
    ticketNo
  };
  const ticket = await (0, _paymentEvent2.default)(condition);
  res.status(200).json({
    message: 'success',
    status: 200,
    ticket
  });
};
/**
 * Fetches all future tickets for a loggedin user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */


const upcomingEventTickets = exports.upcomingEventTickets = async (req, res) => {
  const {
    id: user
  } = req.user;
  const condition = {
    '$PaymentEvents.user$': user,
    '$PaymentEvents.expireBy$': {
      [Op.gte]: new Date().toISOString()
    }
  };
  const events = await Event.findAll({
    where: condition,
    include: [{
      model: PaymentEvents,
      include: [{
        model: Event,
        as: 'events',
        required: true
      }]
    }]
  });
  res.status(200).json({
    message: 'success',
    status: 200,
    events
  });
};
/**
 * Fetches all past tickets for a loggedin user
 * @param {Object} req - Requests from client
 * @param {*} res - Response from the db
 * @returns {Object} Response
 */


const pastEventTickets = exports.pastEventTickets = async (req, res) => {
  const {
    id: user
  } = req.user;
  const condition = {
    '$PaymentEvents.user$': user,
    '$PaymentEvents.expireBy$': {
      [Op.lte]: new Date().toISOString()
    }
  };
  const events = await Event.findAll({
    where: condition,
    include: [{
      model: PaymentEvents,
      include: [{
        model: Event,
        as: 'events',
        required: true
      }]
    }]
  });
  res.status(200).json({
    message: 'success',
    status: 200,
    events
  });
};