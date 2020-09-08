import httpError from '../errorsHandler/httpError';
import models from '../../models';

const {
  Ticket,
  TicketCategory,
  Event,
  PaymentEvents,
  commentEvent,
  replayComment
} = models;

export default async slug => {
  const event = await Event.findOne({
    where: { slug },
    include: [
      {
        model: Ticket,
        include: [{ model: TicketCategory, as: 'ticketCategory' }]
      },
      {
        model: PaymentEvents,
        include: [{ model: Event, as: 'events' }]
      },
      {
        model: commentEvent,
        include: [{ model: replayComment }]
      }
    ]
  });
  if (event === null) {
    throw new httpError(404, 'Event not found');
  }
  return event;
};
