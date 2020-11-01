"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCategoryDesignation = exports.checkCategory = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  TicketCategory
} = _index2.default;

const checkCategory = async (req, res, next) => {
  const {
    ticketCategoryId
  } = req.params;
  const category = await TicketCategory.findOne({
    where: {
      id: ticketCategoryId
    }
  });

  if (!category) {
    throw new _httpError2.default(404, 'Category does not exist');
  }

  next();
};

const checkCategoryDesignation = async (req, res, next) => {
  const {
    designation
  } = req.body;
  const category = await TicketCategory.findOne({
    where: {
      designation
    }
  });

  if (category) {
    throw new _httpError2.default(400, 'Category already exist');
  }

  next();
};

exports.checkCategory = checkCategory;
exports.checkCategoryDesignation = checkCategoryDesignation;