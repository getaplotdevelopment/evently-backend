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
  Roles
} = _index2.default;

exports.default = async (model, id) => {
  const data = await model.findOne({
    where: {
      id
    },
    include: [{
      model: Roles,
      as: 'roles',
      where: {
        designation: 'ORGANIZER'
      }
    }]
  });

  if (!data) {
    throw new _httpError2.default(400, 'Only organizers can be approved');
  }

  return data;
};