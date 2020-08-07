import models from '../../models';

const { User, commentEvent } = models;

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
    const where = { id: commentId, isDeleted: false };
    const comment = await commentEvent.findOne({
      where,
      include: includeUser()
    });
    if (!comment) {
      console.log('here');
      return res.status(404).json({
        status: 404,
        message: 'No comment found'
      });
    }
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
    const where = { id, isDeleted: false };
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
    if (deleteComment[0] === 1) {
      res.status(200).json({
        status: 200,
        message: 'Comment successfully deleted'
      });
    }
  }
}

export default CommentEventController;
