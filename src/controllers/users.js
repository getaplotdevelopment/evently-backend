import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import models from '../models/index';
import httpError from '../helpers/errorsHandler/httpError';
import generateToken from '../helpers/generateToken/generateToken';
import sendEmail from '../helpers/sendEmail/callMailer';
import geocode from '../helpers/googleMap/goecode';
import { redisClient } from '../helpers/logout/redisClient';
import { getRole } from '../helpers/sendEmail/emailTemplates';
import findOneHelper from '../helpers/rolesHelper/findOneHelper';

dotenv.config();
const { User, Roles, Follow, UserActivity, Experience, Friend } = models;
const { secretKey, MAILER_URL } = process.env;
const includeUser = () => {
  return [
    {
      model: Experience
    }
  ];
};

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
      redirectUrl
    } = req.body;
    const email = req.body.email.toLowerCase();
    const gavatar = gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });
    const avatar = gavatar.slice(2, gavatar.length);
    const roleDesignation = req.body.role ? req.body.role : 'USER';
    const { dataValues } = await findOneHelper(Roles, {
      designation: roleDesignation
    });
    const role = dataValues.designation;

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
      role,
      redirectUrl
    };
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const userInstance = await User.create(newUser);
    const createdUser = userInstance.dataValues;
    const assignedRole = await findOneHelper(Roles, {
      designation: createdUser.role
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
    await UserActivity.create({
      designation: 'Registration',
      userId: user.id
    });
    const tokenGenerated = generateToken(payload);
    const token = tokenGenerated.generate;
    res.status(201).json({
      status: 201,
      user,
      token,
      response: 'Email Sent'
    });
    req.body.template = 'verification';
    getRole(user.role, MAILER_URL, token);
    await sendEmail(user.email, token, 'verification');
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
      where: {
        email
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'avatar',
        'isActivated',
        'role',
        'location',
        'phoneNumber'
      ]
    });
    const {
      id,
      firstName,
      lastName,
      userName,
      avatar,
      isActivated,
      location,
      phoneNumber
    } = user;
    const payload = {
      id,
      firstName,
      lastName,
      userName,
      avatar,
      email: user.email,
      isActivated,
      location,
      phoneNumber
    };
    await UserActivity.create({
      designation: 'login',
      userId: payload.id
    });
    const generatedToken = generateToken(payload);
    const token = generatedToken.generate;
    return res.status(200).json({
      status: 200,
      user: payload,
      token
    });
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
    await UserActivity.create({
      designation: 'Login via social media',
      userId: payload.id
    });
    const { generate } = generateToken(payload);
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'production'
    ) {
      return res.status(201).json({
        status: 201,
        result: result[0],
        token: generate
      });
    }
    return result;
  }

  /**
   *
   * @param {Object} req
   * @param {*} res
   * @returns {Object} Json data
   */
  async socialAuthentication(req, res) {
    const { firstName, lastName, email, avatar } = req.body;
    const role = req.body.role ? req.body.role : 1;
    const user = {
      firstName,
      lastName,
      email,
      avatar,
      isActivated: true,
      role
    };
    const assignedRole = await Roles.findOne({
      where: {
        id: user.role
      }
    });
    const { designation } = assignedRole.dataValues;
    const payload = {
      firstName,
      lastName,
      email,
      avatar,
      isActivated: true,
      role: designation
    };
    const result = await User.findOrCreate({
      where: {
        email
      },
      defaults: user
    });
    const { generate: token } = generateToken(payload);

    return res.status(200).json({
      status: 200,
      payload,
      token
    });
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  async checkEmail(req, res) {
    const { email, redirectUrl } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new httpError(404, 'No user found with that email address');
    }
    const foundUser = user.dataValues;
    const payload = {
      email: foundUser.email
    };

    const tokenGenerated = generateToken(payload);
    const token = tokenGenerated.generate;
    req.body.template = 'resetPassword';
    getRole(foundUser.role, redirectUrl, token);
    await sendEmail(foundUser.email, token, 'resetPassword');

    res.status(200).send({
      status: 200,
      message:
        'Success, Link for resetting your password has been sent, please check your email'
    });
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  async resendVerificationEmail(req, res) {
    const { email, redirectUrl } = req.body;

    const user = await User.findOne({
      where: {
        email
      }
    });

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
    getRole(foundUser.role, redirectUrl, token);
    const response = await sendEmail(foundUser.email, token);

    res.status(200).send({
      status: 200,
      response
    });
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
    const { token } = req.params;
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
    const { token } = req.params;
    const user = jwt.decode(token, secretKey);
    const userLink = await User.findOne({
      where: {
        email: user.email
      }
    });
    await redisClient.LPUSH('token', token);

    if (user) {
      const [rowsUpdated, [updatedAccount]] = await User.update(
        {
          isActivated: true
        },
        {
          where: {
            email: user.email
          },
          returning: true
        }
      );
      return res.status(200).redirect(`${userLink.dataValues.redirectUrl}`);
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
      {
        password: newPassword
      },
      {
        where: {
          id
        }
      }
    );
    await UserActivity.create({ designation: 'change password', userId: id });
    res.status(200).json({
      status: 200,
      message: 'Password updated successfully'
    });
  }

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async updateLocation(req, res) {
    const { location } = req.body;
    const { email } = req.user;
    const userInstance = await User.findOne({
      where: {
        email
      }
    });
    res.send({
      status: 200,
      message: 'Successfully updated'
    });
    await UserActivity.create({
      designation: 'update my location',
      userId: userInstance.id
    });
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
    const { userId: following } = req.params;
    const { email: follower } = req.user;
    const isUserExist = await User.findOne({
      where: {
        id: following
      },
      include: includeUser(),
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'avatar',
        'isActivated'
      ]
    });
    const flwerUser = await User.findOne({
      where: { email: follower },
      include: includeUser(),
      attributes: {
        exclude: [
          'password',
          'isActivated',
          'deviceToken',
          'createdAt',
          'updatedAt'
        ]
      }
    });
    const { dataValues: followerObj } = flwerUser;

    if (!isUserExist) {
      throw new httpError(404, 'User does not exist');
    }
    const { dataValues: followingObj } = isUserExist;

    const isFollowed = await Follow.findOne({
      where: {
        isFollowing: true,
        following: followingObj.email,
        follower
      }
    });
    if (isFollowed) {
      throw new httpError(409, 'User already followed');
    }
    const canFollow = await Follow.findOne({
      where: {
        isFollowing: false,
        following: followingObj.email,
        follower
      }
    });
    if (canFollow) {
      const [rowCount, [data]] = await Follow.update(
        {
          isFollowing: true
        },
        {
          where: {
            isFollowing: false,
            following: followingObj.email,
            follower
          },
          returning: true
        }
      );
      const { dataValues } = data;
      followingObj.email = undefined;
      return res.send({
        status: 200,
        follow: true,
        data: dataValues
      });
    }
    const response = await Follow.create({
      following: followingObj.email,
      follower,
      followerObj,
      followingObj,
      isFollowing: true
    });

    followingObj.email = undefined;

    return res.send({
      status: 200,
      follow: true,
      data: response
    });
  }

  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async unfollowUser(req, res) {
    const { userId: following } = req.params;
    const { email: follower } = req.user;
    const isUserExist = await User.findOne({
      where: {
        id: following
      }
    });
    if (!isUserExist) {
      throw new httpError(404, 'User does not exist');
    }
    const { dataValues: userObj } = isUserExist;

    const isunFollowed = await Follow.findOne({
      where: {
        follower,
        following: userObj.email,
        isFollowing: true
      }
    });

    if (!isunFollowed) {
      throw new httpError(404, 'User already unfollowed');
    }
    await Follow.update(
      { isFollowing: false },
      {
        where: {
          follower,
          following: userObj.email
        }
      }
    );
    return res.send({
      status: 200,
      follow: false,
      user: {
        firstname: userObj.firstName,
        lastname: userObj.lastName,
        username: userObj.userName,
        avatar: userObj.avatar
      },
      message: 'User unfollowed'
    });
  }

  /**
   *
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async myFollowers(req, res) {
    const { user } = req;
    const followers = await Follow.findAll({
      attributes: ['followerObj'],
      where: {
        isFollowing: true,
        follower: {
          [Op.not]: user.email
        },
        following: user.email
      }
    });
    if (!followers.length) {
      return res.status(200).json({
        status: 200,
        message: "You don't have any followers so far"
      });
    }
    return res.status(200).json({
      status: 200,
      followers
    });
  }

  /**
   *
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async myFollowings(req, res) {
    const { user } = req;
    const follwings = await Follow.findAll({
      attributes: ['followingObj'],
      where: {
        isFollowing: true,
        following: {
          [Op.not]: user.email
        },
        follower: user.email
      }
    });
    if (!follwings.length) {
      return res.status(200).json({
        status: 200,
        message: 'your are not following any one by now'
      });
    }

    return res.status(200).json({
      status: 200,
      follwings
    });
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

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async deactivateUser(req, res) {
    const { id } = req.body;

    const [rowsUpdated, [updatedAccount]] = await User.update(
      {
        isDeactivated: true
      },
      {
        where: {
          id
        },
        returning: true
      }
    );

    res.status(200).json({
      status: 200,
      accountsUpdated: rowsUpdated,
      isDeactivated: updatedAccount.dataValues.isDeactivated
    });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async reactivateUser(req, res) {
    const { id } = req.body;

    const [rowsUpdated, [updatedAccount]] = await User.update(
      {
        isDeactivated: false
      },
      {
        where: {
          id
        },
        returning: true
      }
    );

    res.status(200).json({
      status: 200,
      accountsUpdated: rowsUpdated,
      isDeactivated: updatedAccount.dataValues.isDeactivated
    });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async approveOrganizer(req, res) {
    const { id } = req.body;

    const [rowsUpdated, [updatedAccount]] = await User.update(
      {
        isApproved: true
      },
      {
        where: {
          id
        },
        returning: true
      }
    );

    res.status(200).json({
      status: 200,
      accountsUpdated: rowsUpdated,
      isDeactivated: updatedAccount.dataValues.isDeactivated
    });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async fetchAdminList(req, res) {
    const where = { role: 'SUPER USER' };
    const admins = await User.findAll({
      where
    });
    if (!admins) {
      return res.status(404).json({
        status: 404,
        message: "We don't currently have a user with this role"
      });
    }
    return res.status(200).json({
      status: 200,
      admins
    });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async fetchOrgnizers(req, res) {
    const where = { role: 'ORGANIZER' };
    const organizers = await User.findAll({
      where
    });

    if (!organizers.length) {
      return res.status(404).json({
        status: 404,
        message: "We don't currently have a user with this role"
      });
    }
    return res.status(200).json({
      status: 200,
      organizers
    });
  }
  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */

  async fetchUsers(req, res) {
    const allUsers = await User.findAll({
      where: { role: 'USER', id: { [Op.not]: req.user.id } }
    });

    if (!allUsers.length) {
      return res.status(404).json({
        status: 404,
        message: 'No users registered yet'
      });
    }

    let users = [];

    const promises = allUsers.map(async user => {
      let friendshipStatus = 'none';

      const alreadySentFriendRequest = await findOneHelper(Friend, {
        from: user.id,
        sentTo: req.user.id
      });

      if (alreadySentFriendRequest) {
        if (alreadySentFriendRequest.dataValues.isFriend === true) {
          friendshipStatus = 'friends';
        } else if (alreadySentFriendRequest.dataValues.sentStatus === 'sent') {
          friendshipStatus = 'Friend request has been already sent to you';
        }
      }

      const findFriendRequest = await findOneHelper(Friend, {
        sentTo: user.id,
        from: req.user.id
      });

      if (findFriendRequest) {
        if (findFriendRequest.dataValues.isFriend === true) {
          friendshipStatus = 'friends';
        } else if (findFriendRequest.dataValues.sentStatus === 'sent') {
          friendshipStatus = 'Friend request already sent';
        }
      }

      return users.push({ friendshipStatus, user });
    });
    await Promise.all(promises);

    return res.status(200).json({
      status: 200,
      count: users.length,
      users
    });
  }

  /**
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */

  async searchUsers(req, res) {
    const { keywords } = req.query;
    if (!keywords) {
      return res.status(200).json({
        status: 404,
        message: 'Please enter something in the search'
      });
    }
    const allUsers = await User.findAll({
      where: {
        [Op.or]: [
          {
            userName: {
              [Op.iLike]: `%${keywords}%`
            }
          },
          {
            firstName: {
              [Op.iLike]: `%${keywords}%`
            }
          },
          {
            lastName: {
              [Op.iLike]: `%${keywords}%`
            }
          }
        ],
        role: 'USER',
        id: { [Op.not]: req.user.id }
      }
    });

    if (!allUsers.length) {
      return res.status(404).json({
        status: 404,
        message: 'No search results found'
      });
    }

    if (!allUsers.length) {
      return res.status(404).json({
        status: 404,
        message: 'No users registered yet'
      });
    }

    let users = [];

    const promises = allUsers.map(async user => {
      let friendshipStatus = 'none';

      const alreadySentFriendRequest = await findOneHelper(Friend, {
        from: user.id,
        sentTo: req.user.id
      });

      if (alreadySentFriendRequest) {
        if (alreadySentFriendRequest.dataValues.isFriend === true) {
          friendshipStatus = 'friends';
        } else if (alreadySentFriendRequest.dataValues.sentStatus === 'sent') {
          friendshipStatus = 'Friend request has been already sent to you';
        }
      }

      const findFriendRequest = await findOneHelper(Friend, {
        sentTo: user.id,
        from: req.user.id
      });

      if (findFriendRequest) {
        if (findFriendRequest.dataValues.isFriend === true) {
          friendshipStatus = 'friends';
        } else if (findFriendRequest.dataValues.sentStatus === 'sent') {
          friendshipStatus = 'Friend request already sent';
        }
      }

      return users.push({ friendshipStatus, user });
    });
    await Promise.all(promises);

    return res.status(200).json({
      status: 200,
      count: users.length,
      users
    });
  }
}

export default UserController;
