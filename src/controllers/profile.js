/* eslint-disable no-restricted-syntax */
import dotenv from 'dotenv';
import fs from 'fs';
import models from '../models/index';
import cloudinary from '../helpers/fileUploadConfig/cloudinary';
import httError from '../helpers/errorsHandler/httpError';
import geocode from '../helpers/googleMap/goecode';
import findOneHelper from '../helpers/rolesHelper/findOneHelper';

dotenv.config();
const { OrganizerProfile, User, UserActivity, Roles } = models;

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

    const uploader = async path => await cloudinary.uploads(path, 'Images');
    const urls = [];
    const files = req.files ? req.files : [];
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const profilePhoto = files.length ? urls[0].url : req.body.profilePhoto;
    const coverPhoto = files.length > 1 ? urls[1].url : req.body.coverPhoto;
    const { id } = req.user;
    const formatted_address = await geocode(location);
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
    const { dataValues } = await findOneHelper(Roles, {
      designation: 'ORGANIZER'
    });
    const role = dataValues.designation;
    await UserActivity.create({ designation: 'Creating profile', userId: id });
    const { dataValues: createdProfile } = await OrganizerProfile.create(
      newProfile
    );
    await User.update(
      {
        role
      },
      {
        where: {
          id
        }
      }
    );
    res.status(201).json({ status: 201, createdProfile });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getUserProfile(req, res) {
    const { organizerId } = req.params;
    const organizerProfile = await OrganizerProfile.findOne({
      where: { organizer: organizerId }
    });
    res.status(200).json({ status: 200, organizerProfile });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getCurrentUserProfile(req, res) {
    const { id } = req.user;
    const organizerProfile = await OrganizerProfile.findOne({
      where: { organizer: id }
    });
    if (!organizerProfile) {
      throw new httError(404, 'You have not add anything on your profile');
    }
    res.status(200).json({ status: 200, organizerProfile });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async updateYourProfile(req, res) {
    const { id } = req.user;
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

    const uploader = async path => await cloudinary.uploads(path, 'Images');
    const urls = [];
    const files = req.files ? req.files : [];
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    await UserActivity.create({ designation: 'Updating profile', userId: id });
    const profilePhoto = files.length ? urls[0].url : undefined;
    const coverPhoto = files.length > 1 ? urls[1].url : undefined;
    const formatted_address = await geocode(location);
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

    const { dataValues } = await OrganizerProfile.update(updatedProfile, {
      where: { organizer: id }
    });
    res.status(200).json({ status: 200, updatedProfile });
  }
}

export default ProfileController;
