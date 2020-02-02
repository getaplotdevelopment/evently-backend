import bcrypt from 'bcryptjs';
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { User } = models;
const { OrganizerProfile } = models;

const checkUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new httpError(409, 'User already exists');
  }
  next();
};

const checkUserProfile = async (req, res, next) => {
  const { organizerId } = req.params;
  const organizer = await OrganizerProfile.findOne({
    where: { organizer: organizerId }
  });
  if (!organizer) {
    throw new httpError(404, 'The user does not have any profile yet');
  }
  next();
};

const checkUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new httpError(401, 'Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new httpError(401, 'Incorrect password');
  }
  next();
};

const checkPassword = async (req, res, next) => {
  const { id } = req.user;
  const { oldPassword } = req.body;

  const user = await User.findOne({ where: { id } });
  if (!user) {
    throw new httpError(404, 'user not found');
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new httpError(
      401,
      'Password does not match, please provide a right password'
    );
  }
  next();
};
export { checkUser, checkUserLogin, checkUserProfile, checkPassword };
