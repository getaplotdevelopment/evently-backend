"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

var _cloudinary = require("../helpers/fileUploadConfig/cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _httpError = require("../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _goecode = require("../helpers/googleMap/goecode");

var _goecode2 = _interopRequireDefault(_goecode);

var _findOneHelper = require("../helpers/rolesHelper/findOneHelper");

var _findOneHelper2 = _interopRequireDefault(_findOneHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-restricted-syntax */
_dotenv2.default.config();

const {
  OrganizerProfile,
  User,
  UserActivity,
  Roles
} = _index2.default;
/**
 * @profile Controller
 * @exports
 * @class
 */

class ProfileController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createProfile(req, res) {
    const {
      accountName,
      description,
      domain,
      location,
      preferences,
      lastLogin,
      accountType
    } = req.body;
    const social = {
      youtube: req.body.youtube,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      instagram: req.body.instqgram
    };

    const uploader = async path => await _cloudinary2.default.uploads(path, 'Images');

    const urls = [];
    const files = req.files ? req.files : [];

    for (const file of files) {
      const {
        path
      } = file;
      const newPath = await uploader(path);
      urls.push(newPath);

      _fs2.default.unlinkSync(path);
    }

    const profilePhoto = files.length ? urls[0].url : req.body.profilePhoto;
    const coverPhoto = files.length > 1 ? urls[1].url : req.body.coverPhoto;
    const {
      id
    } = req.user;
    const formatted_address = await (0, _goecode2.default)(location);
    const newProfile = {
      accountName,
      description,
      domain,
      location: formatted_address,
      profilePhoto,
      coverPhoto,
      preferences,
      lastLogin,
      accountType,
      social,
      organizer: id
    };
    const {
      dataValues
    } = await (0, _findOneHelper2.default)(Roles, {
      designation: 'ORGANIZER'
    });
    const role = dataValues.designation;
    await UserActivity.create({
      designation: 'Creating profile',
      userId: id
    });
    const {
      dataValues: createdProfile
    } = await OrganizerProfile.create(newProfile);
    await User.update({
      role
    }, {
      where: {
        id
      }
    });
    res.status(201).json({
      status: 201,
      createdProfile
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */


  async getUserProfile(req, res) {
    const {
      organizerId
    } = req.params;
    const organizerProfile = await OrganizerProfile.findOne({
      where: {
        organizer: organizerId
      }
    });
    res.status(200).json({
      status: 200,
      organizerProfile
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */


  async getCurrentUserProfile(req, res) {
    const {
      id
    } = req.user;
    const organizerProfile = await OrganizerProfile.findOne({
      where: {
        organizer: id
      }
    });

    if (!organizerProfile) {
      throw new _httpError2.default(404, 'You have not add anything on your profile');
    }

    res.status(200).json({
      status: 200,
      organizerProfile
    });
  }
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */


  async updateYourProfile(req, res) {
    const {
      id
    } = req.user;
    const {
      accountName,
      description,
      domain,
      location,
      preferences,
      lastLogin,
      accountType,
      social
    } = req.body;

    const uploader = async path => await _cloudinary2.default.uploads(path, 'Images');

    const urls = [];
    const files = req.files ? req.files : [];

    for (const file of files) {
      const {
        path
      } = file;
      const newPath = await uploader(path);
      urls.push(newPath);

      _fs2.default.unlinkSync(path);
    }

    await UserActivity.create({
      designation: 'Updating profile',
      userId: id
    });
    const profilePhoto = files.length ? urls[0].url : undefined;
    const coverPhoto = files.length > 1 ? urls[1].url : undefined;
    const formatted_address = await (0, _goecode2.default)(location);
    const updatedProfile = {
      accountName,
      description,
      domain,
      location: formatted_address,
      profilePhoto,
      coverPhoto,
      preferences,
      lastLogin,
      accountType,
      social,
      organizer: id
    };
    const {
      dataValues
    } = await OrganizerProfile.update(updatedProfile, {
      where: {
        organizer: id
      }
    });
    res.status(200).json({
      status: 200,
      updatedProfile
    });
  }

}

exports.default = ProfileController;