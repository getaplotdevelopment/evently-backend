"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpError = require("../errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Ticket,
  TicketCategory,
  Event,
  PaymentEvents,
  commentEvent,
  replayComment,
  Likes,
  User
} = _models2.default;

exports.default = async slug => {
  const event = await Event.findOne({
    where: {
      slug
    },
    include: [{
      model: Ticket,
      include: [{
        model: TicketCategory,
        as: 'ticketCategory'
      }]
    }, {
      model: PaymentEvents,
      include: [{
        model: Event,
        as: 'events'
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
    }]
  });

  if (event === null) {
    throw new _httpError2.default(404, 'Event not found');
  }

  return event;
};