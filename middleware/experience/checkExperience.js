import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { Experience, CommentExperience } = models;

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

export { checkExperience, checkExperienceComment };
