/* eslint-disable no-restricted-globals */
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { commentEvent } = models;

const checkComment = async (req, res, next) => {
  const { commentId: id } = req.params;
  if (isNaN(id)) {
    throw new httpError(400, 'comment ID must be a number');
  }
  const event = await commentEvent.findOne({
    where: { id, isDeleted: false }
  });
  if (!event) {
    throw new httpError(404, 'Comment not found');
  }
  next();
};

const checkCommentOnEvent = async (req, res, next) => {
  const { commentId: id, slug: event } = req.params;
  if (isNaN(id)) {
    throw new httpError(400, 'comment ID must be a number');
  }
  const comment = await commentEvent.findOne({
    where: { id, event, isDeleted: false }
  });
  if (!comment) {
    throw new httpError(404, 'Comment not found');
  }
  req.comment = comment;
  next();
};

const checkCommentOwner = async (req, res, next) => {
  const { commentId: id } = req.params;
  const { user } = req;
  const comment = await commentEvent.findOne({
    where: { id }
  });
  const { dataValues } = comment;
  if (dataValues.user !== user.id) {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkCommentOwnerOrAdmin = async (req, res, next) => {
  const { commentId: id } = req.params;
  const { user } = req;
  const comment = await commentEvent.findOne({
    where: { id }
  });
  const { dataValues } = comment;
  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};

export { checkComment, checkCommentOwner, checkCommentOwnerOrAdmin, checkCommentOnEvent };
