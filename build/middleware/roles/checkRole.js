"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRoleDesignation = exports.checkRole = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Roles
} = _index2.default;

const checkRole = async (req, res, next) => {
  const {
    roleId
  } = req.params;
  const role = await Roles.findOne({
    where: {
      id: roleId
    }
  });

  if (!role) {
    throw new _httpError2.default(404, 'Role does not exist');
  }

  next();
};

const checkRoleDesignation = async (req, res, next) => {
  const {
    designation
  } = req.body;
  const role = await Roles.findOne({
    where: {
      designation
    }
  });

  if (role) {
    throw new _httpError2.default(400, 'Role already exist');
  }

  next();
};

exports.checkRole = checkRole;
exports.checkRoleDesignation = checkRoleDesignation;