import httpError from '../errorsHandler/httpError';
import models from '../../models';

const {
  Ticket,
  TicketCategory,
  Event,
  PaymentEvents,
  commentEvent,
  replayComment, 
  Likes,
  User
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
      },
      {
        model: Likes,
        include: [{ 
          model: User,
          as: 'likedBy',
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
        }],
        
      }
    ]
  });
  if (event === null) {
    throw new httpError(404, 'Event not found');
  }
  return event;
};
