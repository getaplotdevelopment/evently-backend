import moment from 'moment';
import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';
import { unixDateConverter, onlyDateHelper } from '../../helpers/timeConverter';

const { FeaturedEvents, Event } = models;

const checkFeaturedEvent = async (req, res, next) => {
  const { slug } = req.params;
  const featuredEvent = await FeaturedEvents.findOne({
    where: { eventSlug: slug }
  });
  if (!featuredEvent) {
    throw new httpError(404, 'featured event not found');
  } else {
    const event = await getSingleEvent(slug);
    const { dataValues } = event;
    req.organizerEmail = dataValues.organizer;
    req.event = slug;
    req.eventObj = dataValues;
  }
  next();
};

const checkOrganizer = async (req, res, next) => {
  const { slug } = req.params;
  const event = await getSingleEvent(slug);
  const { dataValues } = event;
  const { organizer } = dataValues;
  const { email } = req.user;

  if (organizer.email !== email) {
    throw new httpError(
      403,
      'Un-authorized, you have to be an organizer of this event to perfom this action'
    );
  }
  next();
};

const checkDates = async (req, res, next) => {
  const { slug } = req.params;
  const { startDate, finishDate } = req.body;
  const event = await getSingleEvent(slug);
  const dateToday = onlyDateHelper(moment());
  if (unixDateConverter(startDate) > unixDateConverter(finishDate)) {
    throw new httpError(
      400,
      'The featured finish date should not be smaller than the featured start date'
    );
  }

  if (unixDateConverter(dateToday) > unixDateConverter(startDate)) {
    throw new httpError(
      400,
      'The featured start date should not go below the date today'
    );
  }

  if (unixDateConverter(finishDate) > unixDateConverter(event.finishDate)) {
    throw new httpError(
      400,
      'The featured finish date should not go beyond the event last date'
    );
  }
  next();
};

export { checkFeaturedEvent, checkDates, checkOrganizer };
