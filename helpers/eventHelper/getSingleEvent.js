import httpError from '../errorsHandler/httpError';
import models from '../../models';
const { Ticket, TicketCategory, Event } = models;

export default async slug => {
  const event = await Event.findOne({
    where: { slug },
    include: [{
      model: Ticket,
      include: [{ model: TicketCategory, as: 'ticketCategory' }]
    }]
  });
  if (event === null) {
    throw new httpError(404, 'Event not found');
  }
  return event;
};
