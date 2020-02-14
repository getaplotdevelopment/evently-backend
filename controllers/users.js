import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models/index';
import httpError from '../helpers/errorsHandler/httpError';
import generateToken from '../helpers/generateToken/generateToken';
import sendEmail from '../helpers/sendEmail/callMailer';

dotenv.config();
const { User } = models;
const { secretKey } = process.env;
/**
 * @user Controller
 * @exports
 * @class
 */
class UserController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async signup(req, res) {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      isAdmin,
      isOrganizer,
      isActivated,
      deviceToken,
      phoneNumber,
      location
    } = req.body;
    const avatar = gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });
    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      avatar,
      password,
      isAdmin,
      isOrganizer,
      isActivated,
      deviceToken,
      phoneNumber,
      location
    };
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const { dataValues: createdUser } = await User.create(newUser);
    const payload = {
      id: createdUser.id,
      email: createdUser.email,
      userName: createdUser.userName,
      avatar: createdUser.avatar,
      isAdmin: createdUser.isAdmin,
      isOrganizer: createdUser.isOrganizer,
      isActivated: createdUser.isActivated
    };
    const user = {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      userName: createdUser.userName,
      email: createdUser.email,
      avatar: createdUser.avatar,
      isAdmin: createdUser.isAdmin,
      isOrganizer: createdUser.isOrganizer,
      isActivated: createdUser.isActivated,
      deviceToken: createdUser.deviceToken,
      phoneNumber: createdUser.phoneNumber,
      location: createdUser.location
    };
    const tokenGenerated = generateToken(payload);
    const token = tokenGenerated.generate;
    const response = await sendEmail(user.email, token);
    res.status(201).json({ status: 201, user, token, response });
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async login(req, res) {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'avatar',
        'isAdmin',
        'isActivated',
        'isOrganizer'
      ]
    });
    const { id, userName, avatar, isAdmin, isOrganizer, isActivated } = user;
    const payload = {
      id,
      userName,
      avatar,
      email: user.email,
      isAdmin,
      isOrganizer,
      isActivated
    };
    const generatedToken = generateToken(payload);
    const token = generatedToken.generate;
    return res.status(200).json({ status: 200, user, token });
  }

  /**
   *
   * @param {Object} req
   * @param {*} res
   * @returns {Object} Json data
   */
  async loginViaSocialMedia(req, res) {
    const socialMediaUser = {
      userName: req.user.username,
      isActivated: true
    };
    const result = await User.findOrCreate({
      where: {
        userName: socialMediaUser.userName
      },
      defaults: socialMediaUser
    });
    const payload = {
      id: result[0].id
    };
    const { generate } = generateToken(payload);
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'production'
    ) {
      return res.status(201).json({
        status: 201,
        result,
        generate
      });
    }
    return result;
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  async checkEmail(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new httpError(404, 'No user found with that email address');
    }
    const foundUser = user.dataValues;
    const payload = {
      email: foundUser.email
    };
    const tokenGenerated = generateToken(payload);
    const token = tokenGenerated.generate;
    req.body.token = token;
    req.body.template = 'resetPassword';
    const response = await sendEmail(foundUser.email, token, 'resetPassword');
    res.status(200).send({ status: 200, response });
  }

  /**
   * Checks if the user with the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  async checkUser(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).send({
        status: 404,
        message: 'No user found with that email address'
      });
    }
    const foundUser = user.dataValues;
    res.status(200).send({
      status: 200,
      user: { email: foundUser.email },
      message: 'User exists'
    });
  }

  /**
   * Resets password.
   * @param {object} req request.
   * @param {object} res response.
   * @returns {object} response.
   */
  async resetPassword(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const { token } = req.body;
    const decoded = jwt.decode(token, secretKey);
    if (decoded) {
      const checkUpdate = await User.update(
        {
          password
        },
        {
          where: {
            email: decoded.email
          }
        }
      );
      if (checkUpdate.length >= 1) {
        return res.status(200).json({
          status: 200,
          message: 'Congratulations! Your password was reset'
        });
      }
    }
    throw new httpError(401, 'Invalid token');
  }

  /**
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async activateAccount(req, res) {
    const { token } = req.params;
    const decoded = jwt.decode(token, secretKey);
    if (decoded) {
      const [rowsUpdated, [updatedAccount]] = await User.update(
        { isActivated: true },
        {
          where: { userName: decoded.user.userName },
          returning: true
        }
      );
      res.status(200).json({
        status: 200,
        accountsUpdated: rowsUpdated,
        isActivated: updatedAccount.dataValues.isActivated
      });
    } else {
      throw new Error('Token is expired or invalid Token');
    }
  }

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async changeCurrentPassword(req, res) {
    const { id } = req.user;
    let { newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    await User.update(
      { password: newPassword },
      {
        where: { id }
      }
    );
    res
      .status(200)
      .json({ status: 200, message: 'Password updated successfully' });
  }
}

export default UserController;
