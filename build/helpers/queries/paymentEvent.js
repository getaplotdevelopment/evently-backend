"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Event,
  PaymentEvents,
  User
} = _models2.default;

exports.default = async condition => {
  return await PaymentEvents.findAll({
    where: condition,
    include: [{
      model: User,
      as: 'eventUser',
      attributes: {
        exclude: ['password', 'isActivated', 'deviceToken', 'role', 'createdAt', 'updatedAt']
      }
    }, {
      model: Event,
      as: 'events',
      attributes: {
        exclude: ['category', 'numberDays', 'startTime', 'startDate', 'finishDate', 'eventType', 'favorited', 'favoritedCount', 'eventImage', 'currentMode', 'createdAt', 'updatedAt', 'isLiked', 'isDeleted', 'popularityCount']
      }
    }]
  });
};