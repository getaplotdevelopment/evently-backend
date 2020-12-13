import bcrypt from 'bcryptjs';
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';
import checkIdHelper from '../../helpers/checkIdHelper';
import checkOrganizerIdHelper from '../../helpers/checkOrganizerIdHelper';

const { User, Feedback, OrganizerProfile } = models;

const checkUser = async (req, res, next) => {
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new httpError(409, 'User already exists');
  }
  next();
};

const checkUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  const userProfile = await OrganizerProfile.findOne({
    where: { user: userId }
  });
  if (!userProfile) {
    throw new httpError(404, 'The user does not have any profile yet');
  }
  next();
};
const checkCurrentProfile = async (req, res, next) => {
  const { id } = req.user;
  const userProfile = await OrganizerProfile.findOne({
    where: { user: id }
  });
  if (!userProfile) {
    throw new httpError(404, 'The user does not have any profile yet');
  }
  req.userProfile = userProfile
  next();
};
const checkProfile = async (req, res, next) => {
  const { id } = req.user;
  const profile = await OrganizerProfile.findOne({ where: { user: id } });
  if (profile) {
    throw new httpError(409, 'You have already a profile');
  }
  next();
};

const checkUserLogin = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new httpError(401, 'Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new httpError(401, 'Invalid credentials');
  }
  next();
};

const checkPassword = async (req, res, next) => {
  const { id } = req.user;
  const { oldPassword } = req.body;

  const user = await User.findOne({ where: { id } });
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new httpError(
      401,
      'Password does not match, please provide a right password'
    );
  }
  next();
};
const isActivate = async (req, res, next) => {
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({
    where: { email, isActivated: true }
  });
  if (!user) {
    throw new httpError(
      401,
      'Kindly check your email and activate your account before login'
    );
  }
  next();
};

const isDeactivated = async (req, res, next) => {
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({
    where: { email, isDeactivated: true }
  });
  if (user) {
    throw new httpError(
      401,
      'Account deactivated, kindly contact the help center service via evently@test.com'
    );
  }
  next();
};
const checkUserId = async (req, res, next) => {
  const { id } = req.body;
  await checkIdHelper(User, id);
  next();
};
const checkOrganizerId = async (req, res, next) => {
  const { id } = req.body;
  await checkOrganizerIdHelper(User, id);
  next();
};
const checkFeedbackId = async (req, res, next) => {
  const { feedbackId } = req.params;
  await checkIdHelper(Feedback, feedbackId);
  next();
};

const checkFeedbackOwner = async (req, res, next) => {
  const { id } = req.user;
  const owner = await Feedback.findOne({ where: { user: id } });
  if (!owner) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  next();
};
const checkFollowUser = async (req, res, next) => {
  const { userId } = req.params;
  if (userId == req.user.id) {
    throw new httpError(403, 'Un-authorized, you can not follow yourself');
  }
  next();
};

export {
  checkUser,
  checkUserLogin,
  checkUserProfile,
  checkPassword,
  checkProfile,
  isActivate,
  isDeactivated,
  checkUserId,
  checkFeedbackId,
  checkFeedbackOwner,
  checkOrganizerId,
  checkFollowUser,
  checkCurrentProfile
};
