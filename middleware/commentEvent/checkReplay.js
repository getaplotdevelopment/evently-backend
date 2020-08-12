/* eslint-disable no-restricted-globals */
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { replayComment } = models;

const checkReplay = async (req, res, next) => {
  const { replayId: id } = req.params;
  if (isNaN(id)) {
    throw new httpError(400, 'replay ID must be a number');
  }
  const event = await replayComment.findOne({
    where: { id }
  });
  if (!event) {
    throw new httpError(404, 'Replay not found');
  }
  next();
};

export { checkReplay };
