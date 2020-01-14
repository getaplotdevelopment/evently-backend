import bcrypt from 'bcryptjs';
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { User } = models;

const checkUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new httpError(409, 'User already exists');
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
export { checkUser, checkUserLogin };
