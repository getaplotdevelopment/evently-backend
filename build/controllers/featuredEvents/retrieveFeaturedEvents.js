"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retrieveOneFeaturedEvent = exports.retrieveFeaturedEvents = undefined;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _getSingleEvent = require("../../helpers/eventHelper/getSingleEvent");

var _getSingleEvent2 = _interopRequireDefault(_getSingleEvent);

var _finOneHelper = require("../../helpers/finOneHelper");

var _finOneHelper2 = _interopRequireDefault(_finOneHelper);

var _timeConverter = require("../../helpers/timeConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  FeaturedEvents,
  Event
} = _index2.default;

const retrieveFeaturedEvents = exports.retrieveFeaturedEvents = async (req, res) => {
  const featuredEvents = await FeaturedEvents.findAll({});
  const updatedFeaturedEvents = featuredEvents.map(async updatedFeaturedEvent => {
    const {
      eventSlug,
      finishDate
    } = updatedFeaturedEvent.dataValues;
    const singleEvent = await (0, _getSingleEvent2.default)(eventSlug);
    const todayDate = (0, _timeConverter.onlyDateHelper)((0, _moment2.default)());

    if ((0, _timeConverter.unixDateConverter)(todayDate) > (0, _timeConverter.unixDateConverter)(finishDate) || singleEvent.isDeleted === true) {
      await updatedFeaturedEvent.update({
        featuredStatus: false
      }, {
        where: {
          eventSlug
        },
        returning: true,
        plain: true
      });
      await Event.update({
        isFeatured: false
      }, {
        where: {
          slug: eventSlug
        },
        returning: true,
        plain: true
      });
    }

    const featuredEvent = await (0, _finOneHelper2.default)(FeaturedEvents, {
      eventSlug,
      featuredStatus: true
    });
    const event = await (0, _finOneHelper2.default)(Event, {
      slug: eventSlug,
      isFeatured: true
    });
    return {
      featuredEvent,
      event
    };
  });
  const resolvedFeaturedEvents = await Promise.all(updatedFeaturedEvents);
  const response = [];
  resolvedFeaturedEvents.filter(resolvedFeaturedEvent => {
    if (resolvedFeaturedEvent.featuredEvent !== null) {
      response.push(resolvedFeaturedEvent);
    }
  });
  return res.status(404).json({
    counts: response.length,
    data: response
  });
};

const retrieveOneFeaturedEvent = exports.retrieveOneFeaturedEvent = async (req, res) => {
  const {
    slug
  } = req.params;
  const featuredEvent = await (0, _finOneHelper2.default)(FeaturedEvents, {
    eventSlug: slug
  });
  const event = await (0, _getSingleEvent2.default)(slug);
  return res.status(200).json({
    message: `Successfully retrieved featured event: ${featuredEvent.eventName}`,
    data: {
      featuredEvent,
      event
    }
  });
};