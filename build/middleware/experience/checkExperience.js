"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkReplayOwnerOradmin = exports.checkReplayOwner = exports.checkCommentOwnerOradmin = exports.checkCommentOwner = exports.checkExperienceOwnerOrAdmin = exports.checkExperienceOwner = exports.checkReplay = exports.checkExperienceComment = exports.checkExperience = undefined;

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Experience,
  CommentExperience,
  ReplayExperienceComment
} = _index2.default;

const checkExperience = async (req, res, next) => {
  const {
    experienceId: id
  } = req.params;
  const experience = await Experience.findOne({
    where: {
      id
    }
  });

  if (!experience) {
    throw new _httpError2.default(404, 'Experience not found');
  }

  next();
};

const checkExperienceComment = async (req, res, next) => {
  const {
    commentId: id
  } = req.params;
  const comment = await CommentExperience.findOne({
    where: {
      id
    }
  });

  if (!comment) {
    throw new _httpError2.default(404, 'Comment not found');
  }

  next();
};

const checkReplay = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;

  if (isNaN(id)) {
    throw new _httpError2.default(400, 'replay ID must be a number');
  }

  const replay = await ReplayExperienceComment.findOne({
    where: {
      id
    }
  });

  if (!replay) {
    throw new _httpError2.default(404, 'Replay not found');
  }

  next();
};

const checkExperienceOwner = async (req, res, next) => {
  const {
    experienceId: id
  } = req.params;
  const {
    user
  } = req;
  const experience = await Experience.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = experience;

  if (dataValues.user !== user.id) {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
  }

  next();
};

const checkExperienceOwnerOrAdmin = async (req, res, next) => {
  const {
    experienceId: id
  } = req.params;
  const {
    user
  } = req;
  const experience = await Experience.findOne({
    where: {
      id
    }
  });
  const {
    dataValues
  } = experience;

  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new _httpError2.default(403, 'Unauthorized to perform this action');
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
  const comment = await Experience.findOne({
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

const checkCommentOwnerOradmin = async (req, res, next) => {
  const {
    commentId: id
  } = req.params;
  const {
    user
  } = req;
  const comment = await Experience.findOne({
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

const checkReplayOwner = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;
  const {
    user
  } = req;
  const replay = await Experience.findOne({
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

const checkReplayOwnerOradmin = async (req, res, next) => {
  const {
    replayId: id
  } = req.params;
  const {
    user
  } = req;
  const replay = await Experience.findOne({
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

exports.checkExperience = checkExperience;
exports.checkExperienceComment = checkExperienceComment;
exports.checkReplay = checkReplay;
exports.checkExperienceOwner = checkExperienceOwner;
exports.checkExperienceOwnerOrAdmin = checkExperienceOwnerOrAdmin;
exports.checkCommentOwner = checkCommentOwner;
exports.checkCommentOwnerOradmin = checkCommentOwnerOradmin;
exports.checkReplayOwner = checkReplayOwner;
exports.checkReplayOwnerOradmin = checkReplayOwnerOradmin;