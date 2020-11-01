"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gravatar = require("gravatar");

var _gravatar2 = _interopRequireDefault(_gravatar);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

var _httpError = require("../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _generateToken = require("../helpers/generateToken/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _callMailer = require("../helpers/sendEmail/callMailer");

var _callMailer2 = _interopRequireDefault(_callMailer);

var _goecode = require("../helpers/googleMap/goecode");

var _goecode2 = _interopRequireDefault(_goecode);

var _redisClient = require("../helpers/logout/redisClient");

var _emailTemplates = require("../helpers/sendEmail/emailTemplates");

var _findOneHelper = require("../helpers/rolesHelper/findOneHelper");

var _findOneHelper2 = _interopRequireDefault(_findOneHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const {
  User,
  Roles,
  Follow,
  UserActivity
} = _index2.default;
const {
  secretKey
} = process.env;
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

    const gavatar = _gravatar2.default.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });

    const avatar = gavatar.slice(2, gavatar.length);
    const roleDesignation = req.body.role ? req.body.role : 'USER';
    const {
      dataValues
    } = await (0, _findOneHelper2.default)(Roles, {
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
      role
    };
    const salt = await _bcryptjs2.default.genSalt(10);
    newUser.password = await _bcryptjs2.default.hash(password, salt);
    const userInstance = await User.create(newUser);
    const createdUser = userInstance.dataValues;
    const assignedRole = await (0, _findOneHelper2.default)(Roles, {
      designation: createdUser.role
    });
    const {
      designation
    } = assignedRole.dataValues;
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
    const tokenGenerated = (0, _generateToken2.default)(payload);
    const token = tokenGenerated.generate;
    res.status(201).json({
      status: 201,
      user,
      token,
      response: 'Email Sent'
    });
    req.body.template = 'verification';
    (0, _emailTemplates.getRole)(user.role, redirectUrl, token);
    await (0, _callMailer2.default)(user.email, token, 'verification');
    const formated_address = await (0, _goecode2.default)(newUser.location);
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
      attributes: ['id', 'firstName', 'lastName', 'userName', 'email', 'avatar', 'isActivated', 'role', 'location', 'phoneNumber']
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
    const generatedToken = (0, _generateToken2.default)(payload);
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
    const {
      generate
    } = (0, _generateToken2.default)(payload);

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      return res.status(201).json({
        status: 201,
        result,
        generate
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
    const {
      firstName,
      lastName,
      email,
      avatar
    } = req.body;
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
    const {
      designation
    } = assignedRole.dataValues;
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
    const {
      generate: token
    } = (0, _generateToken2.default)(payload);
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
    const {
      email,
      redirectUrl
    } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new _httpError2.default(404, 'No user found with that email address');
    }

    const foundUser = user.dataValues;
    const payload = {
      email: foundUser.email
    };
    const tokenGenerated = (0, _generateToken2.default)(payload);
    const token = tokenGenerated.generate;
    req.body.template = 'resetPassword';
    (0, _emailTemplates.getRole)(foundUser.role, redirectUrl, token);
    await (0, _callMailer2.default)(foundUser.email, token, 'resetPassword');
    res.status(200).send({
      status: 200,
      message: 'Success, Link for resetting your password has been sent, please check your email'
    });
  }
  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */


  async resendVerificationEmail(req, res) {
    const {
      email,
      redirectUrl
    } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new _httpError2.default(404, 'No user found with that email address');
    }

    const foundUser = user.dataValues;
    const payload = {
      email: foundUser.email
    };
    const tokenGenerated = (0, _generateToken2.default)(payload);
    const token = tokenGenerated.generate;
    req.body.token = token;
    (0, _emailTemplates.getRole)(foundUser.role, redirectUrl, token);
    const response = await (0, _callMailer2.default)(foundUser.email, token);
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
    const password = _bcryptjs2.default.hashSync(req.body.password, 10);

    const {
      token
    } = req.params;
    await _redisClient.redisClient.LPUSH('token', token);

    const decoded = _jsonwebtoken2.default.decode(token, secretKey);

    if (decoded) {
      const checkUpdate = await User.update({
        password
      }, {
        where: {
          email: decoded.email
        }
      });

      if (checkUpdate.length >= 1) {
        return res.status(200).json({
          status: 200,
          message: 'Congratulations! Your password was reset'
        });
      }
    }

    throw new _httpError2.default(401, 'Invalid token');
  }
  /**
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */


  async activateAccount(req, res) {
    const {
      token
    } = req.params;

    const user = _jsonwebtoken2.default.decode(token, secretKey);

    await _redisClient.redisClient.LPUSH('token', token);

    if (user) {
      const [rowsUpdated, [updatedAccount]] = await User.update({
        isActivated: true
      }, {
        where: {
          email: user.email
        },
        returning: true
      });
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
    const {
      id
    } = req.user;
    let {
      newPassword
    } = req.body;
    const salt = await _bcryptjs2.default.genSalt(10);
    newPassword = await _bcryptjs2.default.hash(newPassword, salt);
    await User.update({
      password: newPassword
    }, {
      where: {
        id
      }
    });
    await UserActivity.create({
      designation: 'change password',
      userId: id
    });
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
    const {
      location
    } = req.body;
    const {
      email
    } = req.user;
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
    const formated_address = await (0, _goecode2.default)(location);
    userInstance.location = formated_address;
    await userInstance.save();
  }
  /**
   * @param {Object} req - Request form user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */


  async followUser(req, res) {
    const {
      userId: following
    } = req.params;
    const {
      email: follower
    } = req.user;
    const isUserExist = await User.findOne({
      where: {
        id: following
      },
      attributes: ['id', 'firstName', 'lastName', 'userName', 'email', 'avatar', 'isActivated']
    });

    if (!isUserExist) {
      throw new _httpError2.default(404, 'User does not exist');
    }

    const {
      dataValues: userObj
    } = isUserExist;
    const isFollowed = await Follow.findOne({
      where: {
        isFollowing: true,
        following: userObj.email,
        follower
      }
    });

    if (isFollowed) {
      throw new _httpError2.default(409, 'User already followed');
    }

    const canFollow = await Follow.findOne({
      where: {
        isFollowing: false,
        following: userObj.email,
        follower
      }
    });

    if (canFollow) {
      const [rowCount, [data]] = await Follow.update({
        isFollowing: true
      }, {
        where: {
          isFollowing: false,
          following: userObj.email,
          follower
        },
        returning: true
      });
      userObj.email = undefined;
      return res.send({
        status: 200,
        follow: true,
        data: userObj
      });
    }

    const response = await Follow.create({
      id: userObj.id,
      following: userObj.email,
      follower,
      isFollowing: true
    });
    userObj.email = undefined;
    response.following = userObj;
    response.follower = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      userName: req.user.userName,
      avatar: req.user.avatar,
      emai: req.user.email
    };
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
    const {
      userId: following
    } = req.params;
    const {
      email: follower
    } = req.user;
    const isUserExist = await User.findOne({
      where: {
        id: following
      }
    });

    if (!isUserExist) {
      throw new _httpError2.default(404, 'User does not exist');
    }

    const {
      dataValues: userObj
    } = isUserExist;
    const isunFollowed = await Follow.findOne({
      where: {
        follower,
        following: userObj.email,
        isFollowing: true
      }
    });

    if (!isunFollowed) {
      throw new _httpError2.default(404, 'User already unfollowed');
    }

    await Follow.update({
      isFollowing: false
    }, {
      where: {
        follower,
        following: userObj.email
      }
    });
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
   * @param {Object} req - Request from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */


  async logout(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    await _redisClient.redisClient.LPUSH('token', token);
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
    const {
      id
    } = req.body;
    const [rowsUpdated, [updatedAccount]] = await User.update({
      isDeactivated: true
    }, {
      where: {
        id
      },
      returning: true
    });
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
    const {
      id
    } = req.body;
    const [rowsUpdated, [updatedAccount]] = await User.update({
      isDeactivated: false
    }, {
      where: {
        id
      },
      returning: true
    });
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
    const {
      id
    } = req.body;
    const [rowsUpdated, [updatedAccount]] = await User.update({
      isApproved: true
    }, {
      where: {
        id
      },
      returning: true
    });
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
    const where = {
      role: 'SUPER USER'
    };
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
    const where = {
      role: 'ORGANIZER'
    };
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

}

exports.default = UserController;