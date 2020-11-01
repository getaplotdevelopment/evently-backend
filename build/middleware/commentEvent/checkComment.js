"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCommentOwnerOrAdmin = exports.checkCommentOwner = exports.checkComment = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-restricted-globals */
const {
  commentEvent
} = _index2.default;

const checkComment = async (req, res, next) => {
  const {
    commentId: id
  } = req.params;

  if (isNaN(id)) {
    throw new _httpError2.default(400, 'comment ID must be a number');
  }

  const event = await commentEvent.findOne({
    where: {
      id
    }
  });

  if (!event) {
    throw new _httpError2.default(404, 'Comment not found');
  }

  next();
};

const checkCommentOwner = async (req, res, next) => {
  const {
    commentId: id
  } = req.params;
  const {
    user
  } = req;
  const comment = await commentEvent.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = comment;

  if (dataValues.user !== user.id) {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
  }

  next();
};

const checkCommentOwnerOrAdmin = async (req, res, next) => {
  const {
    commentId: id
  } = req.params;
  const {
    user
  } = req;
  const comment = await commentEvent.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = comment;

  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
  }

  next();
};

exports.checkComment = checkComment;
exports.checkCommentOwner = checkCommentOwner;
exports.checkCommentOwnerOrAdmin = checkCommentOwnerOrAdmin;