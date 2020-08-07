import models from '../../models';
import findOneHelper from '../../helpers/finOneHelper';

const { User, commentEvent, Event } = models;

const includeUser = () => {
  return [
    {
      model: User,
      as: 'owner',
      attributes: {
        exclude: [
          'password',
          'isActivated',
          'deviceToken',
          'role',
          'createdAt',
          'updatedAt'
        ]
      }
    }
  ];
};

/**
 * @CommentEventController Controller
 * @exports
 * @class
 */
class CommentEventController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async createComment(req, res) {
    const { slug } = req.params;
    const { text, img, isHidden } = req.body;
    const { id: user } = req.organizer || req.user;
    const comment = {
      text,
      img,
      isHidden,
      user,
      event: slug
    };
    const newComment = await commentEvent.create(comment);
    res.status(201).json({
      status: 201,
      comment: newComment
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async getOneComment(req, res) {
    const { commentId } = req.params;
    const where = { id: commentId };
    const comment = await commentEvent.findOne({
      where,
      include: includeUser()
    });
    res.status(200).json({
      status: 200,
      comment
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async updateComment(req, res) {
    const { commentId: id } = req.params;
    const { text, img, isHidden } = req.body;
    const where = { id };
    const comment = {
      text,
      img,
      isHidden
    };
    const updateComment = await commentEvent.update(comment, {
      where
    });
    if (updateComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'event successfully updated'
      });
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {*} res - Response from the db
   * @returns {Object} Response
   */
  async deleteComment(req, res) {
    const { commentId: id } = req.params;
    const where = { id };
    const comment = {
      isDeleted: true
    };
    const deleteComment = await commentEvent.update(comment, {
      where
    });
    console.log('deleteComment', deleteComment);
  }
}

export default CommentEventController;
