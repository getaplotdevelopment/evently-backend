import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models/index';
import httpError from '../helpers/errorsHandler/httpError';
import generateToken from '../helpers/generateToken/generateToken';
import sendEmail from '../helpers/sendEmail/callMailer';
import geocode from '../helpers/googleMap/goecode';
import { redisClient } from '../helpers/logout/redisClient';
import { getRole } from '../helpers/sendEmail/emailTemplates';

dotenv.config();
const { User, Roles, Follow } = models;
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
      password,
      isActivated,
      deviceToken,
      phoneNumber,
      location,
      urls
    } = req.body;
    const email = req.body.email.toLowerCase();
    const gavatar = gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });
    const avatar = gavatar.slice(2, gavatar.length);
    const role = req.body.role ? req.body.role : 1;
    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      avatar,
      password,
      isActivated,
      deviceToken,
      phoneNumber,
      location,
      role
    };
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const userInstance = await User.create(newUser);
    const createdUser = userInstance.dataValues;
    const assignedRole = await Roles.findOne({
      where: { id: createdUser.role }
    });
    const { designation } = assignedRole.dataValues;

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
      userName: createdUser.userName,
      avatar: createdUser.avatar,
      isActivated: createdUser.isActivated,
      role: designation
    };

    const user = {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      userName: createdUser.userName,
      email: createdUser.email,
      avatar: createdUser.avatar,
      isActivated: createdUser.isActivated,
      deviceToken: createdUser.deviceToken,
      phoneNumber: createdUser.phoneNumber,
      location: createdUser.location,
      role: designation
    };
    const tokenGenerated = generateToken(payload);
    const token = tokenGenerated.generate;
    res.status(201).json({ status: 201, user, token, response: 'Email Sent' });
    getRole(user.role, urls);
    await sendEmail(user.email, token);
    const formated_address = await geocode(newUser.location);
    userInstance.location = formated_address;
    await userInstance.save();
  }

  /**
   *
   * @param {Object} req - Request from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async login(req, res) {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Roles,
          as: 'roles'
        }
      ],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'avatar',
        'isActivated',
        'role'
      ]
    });
    const assignedRole = await Roles.findOne({
      where: { id: user.role }
    });
    const { designation: role } = assignedRole.dataValues;
    const { id, firstName, lastName, userName, avatar, isActivated } = user;
    const payload = {
      id,
      firstName,
      lastName,
      userName,
      avatar,
      email: user.email,
      isActivated,
      role
    };
    const generatedToken = generateToken(payload);
    const token = generatedToken.generate;
    return res.status(200).json({ status: 200, user: payload, token });
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
    const { email, urls } = req.body;

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
    getRole(foundUser.role, urls);
    const response = await sendEmail(foundUser.email, token, 'resetPassword');

    res.status(200).send({ status: 200, response });
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  async resendVerificationEmail(req, res) {
    const { email, urls } = req.body;

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
    getRole(foundUser.role, urls);
    const response = await sendEmail(foundUser.email, token);

    res.status(200).send({ status: 200, response });
  }

  /**
   * Checks if the user with the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */

  /**
   * Resets password.
   * @param {object} req request.
   * @param {object} res response.
   * @returns {object} response.
   */
  async resetPassword(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const { token } = req.body;
    await redisClient.LPUSH('token', token);
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
    const { token } = req.query;
    const user = jwt.decode(token, secretKey);
    await redisClient.LPUSH('token', token);

    if (user) {
      const [rowsUpdated, [updatedAccount]] = await User.update(
        { isActivated: true },
        {
          where: { email: user.email },
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

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async updateLocation(req, res) {
    const { location } = req.body;
    const { email } = req.user;
    const userInstance = await User.findOne({ where: { email } });
    res.send({ status: 200, message: 'Successfully updated' });
    const formated_address = await geocode(location);
    userInstance.location = formated_address;
    await userInstance.save();
  }

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async followUser(req, res) {
    const { user_email: follower } = req.params;
    const { email: following } = req.user;
    const isUserExist = await User.findOne({
      where: { email: follower }
    });
    if (!isUserExist) {
      throw new httpError(404, 'User does not exist');
    }
    const isFollowed = await Follow.findOne({
      where: { follower, following }
    });
    if (isFollowed) {
      throw new httpError(409, 'User already followed');
    }
    const dataValues = await Follow.create({
      follower,
      following
    });
    return res.send({ status: 200, follow: true, data: dataValues });
  }

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async unfollowUser(req, res) {
    const { user_email: follower } = req.params;
    const { email: following } = req.user;
    const isUserExist = await User.findOne({
      where: { email: follower }
    });
    if (!isUserExist) {
      throw new httpError(404, 'User does not exist');
    }
    const isunFollowed = await Follow.findOne({
      where: { follower, following }
    });
    if (!isunFollowed) {
      throw new httpError(404, 'User does not exist');
    }
    const dataValues = await Follow.destroy({
      where: { follower, following }
    });
    return res.send({ status: 200, follow: false, message: 'User unfollowed' });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async logout(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    await redisClient.LPUSH('token', token);
    return res.status(200).json({
      status: 200,
      message: 'You are logged out'
    });
  }
}

export default UserController;
