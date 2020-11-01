"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPaidEventTicket = exports.checkTicketEvent = exports.checkAccessTicket = exports.checkTicket = exports.checkTicketExist = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Ticket,
  PaymentEvents
} = _index2.default;

const checkTicketExist = async (req, res, next) => {
  const {
    category
  } = req.body;
  const {
    slug
  } = req.params;
  const ticket = await Ticket.findOne({
    where: {
      event: slug,
      category
    }
  });

  if (ticket) {
    throw new _httpError2.default(404, 'Ticket with this category has already being added, select a new category');
  }

  next();
};

const checkTicket = async (req, res, next) => {
  const {
    ticketId
  } = req.params;
  const ticket = await Ticket.findOne({
    where: {
      ticketNumber: ticketId
    }
  });

  if (!ticket) {
    throw new _httpError2.default(404, 'Ticket not found');
  }

  next();
};

const checkTicketEvent = async (req, res, next) => {
  const {
    slug
  } = req.params;
  const {
    ticket_ids
  } = req.body;

  for (const ticketNumber of ticket_ids) {
    const ticket = await Ticket.findOne({
      where: {
        ticketNumber,
        event: slug,
        status: 'available'
      }
    });

    if (!ticket) {
      throw new _httpError2.default(404, 'Ticket(s) not found');
    }
  }

  next();
};

const checkPaidEventTicket = async (req, res, next) => {
  const {
    slug,
    ticketId
  } = req.params;
  const ticket = await PaymentEvents.findOne({
    where: {
      ticketNo: ticketId,
      event: slug
    }
  });

  if (!ticket) {
    throw new _httpError2.default(404, 'Ticket not found');
  }

  const {
    dataValues
  } = ticket;
  req.payment = dataValues;
  req.ticketNumber = ticketId;
  next();
};

const checkAccessTicket = async (req, res, next) => {
  const {
    id
  } = req.organizer;
  const ticket = await Ticket.findOne({
    where: {
      organizer: id
    }
  });

  if (!ticket) {
    throw new _httpError2.default(409, 'Un-authorized, you do not own this ticket, you can not update it');
  }

  next();
};

exports.checkTicketExist = checkTicketExist;
exports.checkTicket = checkTicket;
exports.checkAccessTicket = checkAccessTicket;
exports.checkTicketEvent = checkTicketEvent;
exports.checkPaidEventTicket = checkPaidEventTicket;