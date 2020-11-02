import models from '../../models';
const { Event, PaymentEvents, User } = models;

export default async condition => {
  return await PaymentEvents.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: 'eventUser',
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
      },
      {
        model: Event,
        as: 'events',
        attributes: {
          exclude: [
            'category',
            'numberDays',
            'startTime',
            'startDate',
            'finishDate',
            'eventType',
            'favorited',
            'favoritedCount',
            'eventImage',
            'currentMode',
            'createdAt',
            'updatedAt',
            'isLiked',
            'isDeleted',
            'popularityCount'
          ]
        }
      }
    ]
  });
};
