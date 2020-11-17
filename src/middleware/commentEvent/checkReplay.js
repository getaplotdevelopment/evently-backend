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
const checkReplayOnComment = async (req, res, next) => {
  const { replayId: id, commentId: commentEvent } = req.params;
  if (isNaN(id)) {
    throw new httpError(400, 'reply ID must be a number');
  }
  const reply = await replayComment.findOne({
    where: { id, commentEvent }
  });
  if (!reply) {
    throw new httpError(404, 'Reply not found');
  }
  req.reply = reply
  next();
};
const checkReplayOwner = async (req, res, next) => {
  const { replayId: id } = req.params;
  const { user } = req;
  const replay = await replayComment.findOne({
    where: { id }
  });
  const { dataValues } = replay;
  if (dataValues.user !== user.id) {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkReplayOwnerOrAdmin = async (req, res, next) => {
  const { replayId: id } = req.params;
  const { user } = req;
  const replay = await replayComment.findOne({
    where: { id }
  });
  const { dataValues } = replay;
  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};

export { checkReplay, checkReplayOwner, checkReplayOwnerOrAdmin, checkReplayOnComment };
