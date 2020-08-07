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
    where: { id }
  });
  if (!event) {
    throw new httpError(404, 'Comment not found');
  }
  next();
};

export { checkComment };
