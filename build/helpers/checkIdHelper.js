"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpError = require("./errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Feedback,
  User
} = _index2.default;

exports.default = async (model, id) => {
  let item;

  if (model === Feedback) {
    item = 'Feedback';
  } else if (model === User) {
    item = 'User';
  }

  const data = await model.findOne({
    where: {
      id
    }
  });

  if (!data) {
    throw new _httpError2.default(404, `${item} not found`);
  }

  return data;
};