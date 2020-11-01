"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkReplayOwnerOrAdmin = exports.checkReplayOwner = exports.checkReplay = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-restricted-globals */
const {
  replayComment
} = _index2.default;

const checkReplay = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;

  if (isNaN(id)) {
    throw new _httpError2.default(400, 'replay ID must be a number');
  }

  const event = await replayComment.findOne({
    where: {
      id
    }
  });

  if (!event) {
    throw new _httpError2.default(404, 'Replay not found');
  }

  next();
};

const checkReplayOwner = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;
  const {
    user
  } = req;
  const replay = await replayComment.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = replay;

  if (dataValues.user !== user.id) {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
  }

  next();
};

const checkReplayOwnerOrAdmin = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;
  const {
    user
  } = req;
  const replay = await replayComment.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = replay;

  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
  }

  next();
};

exports.checkReplay = checkReplay;
exports.checkReplayOwner = checkReplayOwner;
exports.checkReplayOwnerOrAdmin = checkReplayOwnerOrAdmin;