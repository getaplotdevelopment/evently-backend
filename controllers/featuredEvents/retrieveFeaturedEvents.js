import moment from 'moment';
import models from '../../models/index';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';
import findOneHelper from '../../helpers/finOneHelper';
import { unixDateConverter, onlyDateHelper } from '../../helpers/timeConverter';

const { FeaturedEvents, Event } = models;

export const retrieveFeaturedEvents = async (req, res) => {
  const featuredEvents = await FeaturedEvents.findAll({});
  const updatedFeaturedEvents = featuredEvents.map(
    async updatedFeaturedEvent => {
      const { eventSlug, finishDate } = updatedFeaturedEvent.dataValues;
      const singleEvent = await getSingleEvent(eventSlug);
      const todayDate = onlyDateHelper(moment());

      if (
        unixDateConverter(todayDate) > unixDateConverter(finishDate) ||
        singleEvent.isDeleted === true
      ) {
        await updatedFeaturedEvent.update(
          { featuredStatus: false },
          { where: { eventSlug }, returning: true, plain: true }
        );
        await Event.update(
          { isFeatured: false },
          { where: { slug: eventSlug }, returning: true, plain: true }
        );
      }
      const featuredEvent = await findOneHelper(FeaturedEvents, {
        eventSlug,
        featuredStatus: true
      });

      const event = await findOneHelper(Event, {
        slug: eventSlug,
        isFeatured: true
      });

      return { featuredEvent, event };
    }
  );

  const resolvedFeaturedEvents = await Promise.all(updatedFeaturedEvents);
  const response = [];
  resolvedFeaturedEvents.filter(resolvedFeaturedEvent => {
    if (resolvedFeaturedEvent.featuredEvent !== null) {
      response.push(resolvedFeaturedEvent);
    }
  });

  return res.status(404).json({
    counts: response.length,
    data: response
  });
};

export const retrieveOneFeaturedEvent = async (req, res) => {
  const { slug } = req.params;

  const featuredEvent = await findOneHelper(FeaturedEvents, {
    eventSlug: slug
  });

  const event = await getSingleEvent(slug);
  return res.status(200).json({
    message: `Successfully retrieved featured event: ${featuredEvent.eventName}`,
    data: { featuredEvent, event }
  });
};
