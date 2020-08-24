import httpError from '../errorsHandler/httpError';
import models from '../../models';

const { Event } = models;
export default async slug => {
  const event = await Event.findOne({
    where: { slug }
  });
  if (event === null) {
    throw new httpError(404, 'Event not found');
  }
  return event;
};
