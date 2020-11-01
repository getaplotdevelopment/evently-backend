"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFollowUser = exports.checkOrganizerId = exports.checkFeedbackOwner = exports.checkFeedbackId = exports.checkUserId = exports.isDeactivated = exports.isActivate = exports.checkProfile = exports.checkPassword = exports.checkUserProfile = exports.checkUserLogin = exports.checkUser = undefined;

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _checkIdHelper = require("../../helpers/checkIdHelper");

var _checkIdHelper2 = _interopRequireDefault(_checkIdHelper);

var _checkOrganizerIdHelper = require("../../helpers/checkOrganizerIdHelper");

var _checkOrganizerIdHelper2 = _interopRequireDefault(_checkOrganizerIdHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  User,
  Feedback,
  OrganizerProfile
} = _index2.default;

const checkUser = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({
    where: {
      email
    }
  });

  if (user) {
    throw new _httpError2.default(409, 'User already exists');
  }

  next();
};

const checkUserProfile = async (req, res, next) => {
  const {
    organizerId
  } = req.params;
  const organizer = await OrganizerProfile.findOne({
    where: {
      organizer: organizerId
    }
  });

  if (!organizer) {
    throw new _httpError2.default(404, 'The user does not have any profile yet');
  }

  next();
};

const checkProfile = async (req, res, next) => {
  const {
    id
  } = req.user;
  const profile = await OrganizerProfile.findOne({
    where: {
      organizer: id
    }
  });

  if (profile) {
    throw new _httpError2.default(409, 'You have already a profile');
  }

  next();
};

const checkUserLogin = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const {
    password
  } = req.body;
  const user = await User.findOne({
    where: {
      email
    }
  });

  if (!user) {
    throw new _httpError2.default(401, 'Invalid credentials');
  }

  const isMatch = await _bcryptjs2.default.compare(password, user.password);

  if (!isMatch) {
    throw new _httpError2.default(401, 'Invalid credentials');
  }

  next();
};

const checkPassword = async (req, res, next) => {
  const {
    id
  } = req.user;
  const {
    oldPassword
  } = req.body;
  const user = await User.findOne({
    where: {
      id
    }
  });
  const isMatch = await _bcryptjs2.default.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new _httpError2.default(401, 'Password does not match, please provide a right password');
  }

  next();
};

const isActivate = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({
    where: {
      email,
      isActivated: true
    }
  });

  if (!user) {
    throw new _httpError2.default(401, 'Kindly check your email and activate your account before login');
  }

  next();
};

const isDeactivated = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({
    where: {
      email,
      isDeactivated: true
    }
  });

  if (user) {
    throw new _httpError2.default(401, 'Account deactivated, kindly contact the help center service via evently@test.com');
  }

  next();
};

const checkUserId = async (req, res, next) => {
  const {
    id
  } = req.body;
  await (0, _checkIdHelper2.default)(User, id);
  next();
};

const checkOrganizerId = async (req, res, next) => {
  const {
    id
  } = req.body;
  await (0, _checkOrganizerIdHelper2.default)(User, id);
  next();
};

const checkFeedbackId = async (req, res, next) => {
  const {
    feedbackId
  } = req.params;
  await (0, _checkIdHelper2.default)(Feedback, feedbackId);
  next();
};

const checkFeedbackOwner = async (req, res, next) => {
  const {
    id
  } = req.user;
  const owner = await Feedback.findOne({
    where: {
      user: id
    }
  });

  if (!owner) {
    throw new _httpError2.default(403, "Un-authorized, User role can't perform this action.");
  }

  next();
};

const checkFollowUser = async (req, res, next) => {
  const {
    userId
  } = req.params;

  if (userId == req.user.id) {
    throw new _httpError2.default(403, 'Un-authorized, you can not follow yourself');
  }

  next();
};

exports.checkUser = checkUser;
exports.checkUserLogin = checkUserLogin;
exports.checkUserProfile = checkUserProfile;
exports.checkPassword = checkPassword;
exports.checkProfile = checkProfile;
exports.isActivate = isActivate;
exports.isDeactivated = isDeactivated;
exports.checkUserId = checkUserId;
exports.checkFeedbackId = checkFeedbackId;
exports.checkFeedbackOwner = checkFeedbackOwner;
exports.checkOrganizerId = checkOrganizerId;
exports.checkFollowUser = checkFollowUser;