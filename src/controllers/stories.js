import uploadCloudinary from '../helpers/eventHelper/uploadCloudinary';
import models from '../models/index';

const { Story, Friend } = models;

/**
 * @stories controller
 * @exports
 * @class
 */
class StoriesController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createStory(req, res) {
    const { caption } = req.body;

    if (!caption && !req.files) {
      return res.status(401).json({ message: "You can't create empty story" });
    }

    const findFriends = await Friend.findAll({
      where: { isFriend: true }
    });

    const allowedFriends = [req.user.id];

    findFriends.forEach(findFriend => {
      if (
        findFriend.from === req.user.id ||
        findFriend.sentTo === req.user.id
      ) {
        allowedFriends.push(findFriend.dataValues.from);
      }
    });

    const picture = req.file
      ? await uploadCloudinary(req.file.buffer)
      : req.body.picture;

    const newStory = {
      caption,
      picture,
      ownerId: req.user.id,
      allowedFriends
    };
    const story = await Story.create(newStory);

    res.status(201).json({ status: 201, story });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getAllStories(req, res) {
    const stories = await Story.findAll({ order: [['createdAt', 'DESC']] });
    if (!stories) {
      res.status(200).json({ status: 400, message: 'No story form that user' });
    }
    const allowedStories = [];
    stories.forEach(story => {
      if (story.dataValues.allowedFriends.find(num => num === req.user.id)) {
        allowedStories.push(story.dataValues);
      }
    });
    if (!allowedStories.length) {
      res
        .status(200)
        .json({ status: 400, message: 'None of your friend posted a story' });
    }
    res.status(200).json({ status: 200, allowedStories });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneStory(req, res) {
    const { storyId } = req.params;
    const story = await Story.findOne({ where: { id: storyId } });
    if (!story) {
      res
        .status(400)
        .json({ status: 200, message: 'No story found with that id' });
    }
    let oneStory = '';
    if (story.dataValues.allowedFriends.find(num => num === req.user.id)) {
      oneStory = story.dataValues;
    }
    if (!oneStory) {
      res.status(400).json({
        status: 200,
        message: 'This story is not of your friends'
      });
    }

    res.status(200).json({ status: 200, oneStory });
  }
}

export default StoriesController;
