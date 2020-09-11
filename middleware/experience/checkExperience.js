import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { Experience, CommentExperience, ReplayExperienceComment } = models;

const checkExperience = async (req, res, next) => {
  const { experienceId: id } = req.params;
  const experience = await Experience.findOne({
    where: { id }
  });
  if (!experience) {
    throw new httpError(404, 'Experience not found');
  }
  next();
};
const checkExperienceComment = async (req, res, next) => {
  const { commentId: id } = req.params;
  const comment = await CommentExperience.findOne({
    where: { id }
  });
  if (!comment) {
    throw new httpError(404, 'Comment not found');
  }
  next();
};
const checkReplay = async (req, res, next) => {
  const { replayId: id } = req.params;
  if (isNaN(id)) {
    throw new httpError(400, 'replay ID must be a number');
  }
  const replay = await ReplayExperienceComment.findOne({
    where: { id }
  });
  if (!replay) {
    throw new httpError(404, 'Replay not found');
  }
  next();
};
const checkExperienceOwner = async (req, res, next) => {
  const { experienceId: id } = req.params;
  const { user } = req;
  const experience = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = experience;
  if (dataValues.user !== user.id) {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkExperienceOwnerOrAdmin = async (req, res, next) => {
  const { experienceId: id } = req.params;
  const { user } = req;
  const experience = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = experience;
  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkCommentOwner = async (req, res, next) => {
  const { commentId: id } = req.params;
  const { user } = req;
  const comment = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = comment;
  if (dataValues.user !== user.id) {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkCommentOwnerOradmin = async (req, res, next) => {
  const { commentId: id } = req.params;
  const { user } = req;
  const comment = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = comment;
  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkReplayOwner = async (req, res, next) => {
  const { replayId: id } = req.params;
  const { user } = req;
  const replay = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = replay;
  if (dataValues.user !== user.id) {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};
const checkReplayOwnerOradmin = async (req, res, next) => {
  const { replayId: id } = req.params;
  const { user } = req;
  const replay = await Experience.findOne({
    where: { id }
  });
  const { dataValues } = replay;
  if (dataValues.user !== user.id && user.role !== 'SUPER USER') {
    throw new httpError(403, 'Unauthorized to perform this action');
  }
  next();
};

export {
  checkExperience,
  checkExperienceComment,
  checkReplay,
  checkExperienceOwner,
  checkExperienceOwnerOrAdmin,
  checkCommentOwner,
  checkCommentOwnerOradmin,
  checkReplayOwner,
  checkReplayOwnerOradmin
};
