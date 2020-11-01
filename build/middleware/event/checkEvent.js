"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkEvent = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Event
} = _index2.default;

const checkEvent = async (req, res, next) => {
  const {
    slug
  } = req.params;
  const event = await Event.findOne({
    where: {
      slug
    }
  });

  if (!event || event.isDeleted === true) {
    throw new _httpError2.default(404, 'Event not found');
  } else {
    const {
      dataValues
    } = event;
    req.organizerEmail = dataValues.organizer;
    req.event = slug;
    req.eventObj = dataValues;
  }

  next();
};

exports.checkEvent = checkEvent;