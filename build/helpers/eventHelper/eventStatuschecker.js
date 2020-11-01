"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpError = require("../errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = eventStatusArray => {
  let newTemplate;
  const template = {
    cancelled: 'freeEventCancellation',
    published: 'freeEventLive',
    postponed: 'freeEventPostponed',
    paused: 'freeEventPaused'
  };
  const requiredStatusType = ['draft', 'published', 'cancelled', 'unpublished', 'postponed', 'paused'];
  const isrequiredStatusType = eventStatusArray.every(item => requiredStatusType.includes(item));

  if (!isrequiredStatusType) {
    throw new _httpError2.default(422, "Invalid eventType, try any from this array ['draft','published','cancelled','unpublished']");
  }

  Object.keys(template).map(temp => {
    if (temp === eventStatusArray[0]) {
      newTemplate = template[temp];
    }
  });
  return newTemplate;
};