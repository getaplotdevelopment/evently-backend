"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkOrganizer = exports.checkDates = exports.checkFeaturedEvent = undefined;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _getSingleEvent = require("../../helpers/eventHelper/getSingleEvent");

var _getSingleEvent2 = _interopRequireDefault(_getSingleEvent);

var _timeConverter = require("../../helpers/timeConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  FeaturedEvents,
  Event
} = _index2.default;

const checkFeaturedEvent = async (req, res, next) => {
  const {
    slug
  } = req.params;
  const featuredEvent = await FeaturedEvents.findOne({
    where: {
      eventSlug: slug
    }
  });

  if (!featuredEvent) {
    throw new _httpError2.default(404, 'featured event not found');
  } else {
    const event = await (0, _getSingleEvent2.default)(slug);
    const {
      dataValues
    } = event;
    req.organizerEmail = dataValues.organizer;
    req.event = slug;
    req.eventObj = dataValues;
  }

  next();
};

const checkOrganizer = async (req, res, next) => {
  const {
    slug
  } = req.params;
  const event = await (0, _getSingleEvent2.default)(slug);
  const {
    dataValues
  } = event;
  const {
    organizer
  } = dataValues;
  const {
    email
  } = req.user;

  if (organizer.email !== email) {
    throw new _httpError2.default(403, 'Un-authorized, you have to be an organizer of this event to perfom this action');
  }

  next();
};

const checkDates = async (req, res, next) => {
  const {
    slug
  } = req.params;
  const {
    startDate,
    finishDate
  } = req.body;
  const event = await (0, _getSingleEvent2.default)(slug);
  const dateToday = (0, _timeConverter.onlyDateHelper)((0, _moment2.default)());

  if ((0, _timeConverter.unixDateConverter)(startDate) > (0, _timeConverter.unixDateConverter)(finishDate)) {
    throw new _httpError2.default(400, 'The featured finish date should not be smaller than the featured start date');
  }

  if ((0, _timeConverter.unixDateConverter)(dateToday) > (0, _timeConverter.unixDateConverter)(startDate)) {
    throw new _httpError2.default(400, 'The featured start date should not go below the date today');
  }

  if ((0, _timeConverter.unixDateConverter)(finishDate) > (0, _timeConverter.unixDateConverter)(event.finishDate)) {
    throw new _httpError2.default(400, 'The featured finish date should not go beyond the event last date');
  }

  next();
};

exports.checkFeaturedEvent = checkFeaturedEvent;
exports.checkDates = checkDates;
exports.checkOrganizer = checkOrganizer;