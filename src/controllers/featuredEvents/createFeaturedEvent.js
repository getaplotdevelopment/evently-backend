import random from 'lodash.random';
import axios from 'axios';
import models from '../../models/index';
import findOneHelper from '../../helpers/finOneHelper';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';
import { unixDateConverter } from '../../helpers/timeConverter';
import { FEATURED_EVENT_AMOUNT_PER_DAY } from '../../constants/featuredEvent';

const { FeaturedEvents, PaymentRequests, Event } = models;
const { PUBLIC_SECRET, enckey, FLUTTERWAVE_URL } = process.env;

const createFeaturedEvent = async (req, res) => {
  const { email, phoneNumber, firstName, lastName, id: user } = req.user;
  const { eventObj } = req;
  const { organizer } = eventObj;
  const tx_ref = `GAT-${random(100000000, 200000000)}`;
  const { slug } = req.params;
  const { startDate, finishDate, currency } = req.body;
  const oneEvent = await getSingleEvent(slug);
  const singleRequest = await findOneHelper(PaymentRequests, { event: slug });

  const featuredDaysTimestamp =
    unixDateConverter(finishDate) - unixDateConverter(startDate);

  let featuredDays;

  if (featuredDaysTimestamp !== 0) {
    featuredDays = Math.round(featuredDaysTimestamp / 86400);
  } else {
    featuredDays = 1;
  }

  const featuredEventAmount = FEATURED_EVENT_AMOUNT_PER_DAY * featuredDays;

  const payload = {
    currency,
    amount: featuredEventAmount,
    payment_options: 'card',
    customer: {
      email,
      phone_number: phoneNumber,
      name: `${firstName} ${lastName}`
    },
    customizations: {
      title: 'Get A Plot',
      description: 'Feature an event',
      isFeatured: true
    },
    tx_ref,
    redirect_url: 'https://google.com',
    enckey
  };

  const hostedLink = await axios({
    url: `${FLUTTERWAVE_URL}payments`,
    method: 'post',
    data: payload,
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });
  const { data } = hostedLink;

  const alreadyFeaturedEvent = await findOneHelper(FeaturedEvents, {
    eventSlug: slug
  });

  const requestData = {
    user,
    organizer: organizer.id,
    event: slug,
    refId: tx_ref,
    expireBy: finishDate,
    isFeatured: true
  };

  if (singleRequest) {
    await PaymentRequests.update(
      {
        refId: tx_ref,
        expireBy: finishDate
      },
      {
        where: { event: slug },
        returning: true,
        plain: true
      }
    );
  } else {
    await PaymentRequests.create(requestData);
  }

  const event = await oneEvent.update(
    { isFeatured: true },
    { where: { slug }, returning: true, plain: true }
  );

  if (alreadyFeaturedEvent) {
    const newFeauturedEvent = await alreadyFeaturedEvent.update(
      {
        startDate,
        finishDate,
        featuredDays,
        amount: featuredEventAmount
      },
      { where: { eventSlug: slug } }
    );

    return res.status(200).send({
      message: 'Featured event is updated successfully',
      data,
      featuredEvent: newFeauturedEvent,
      event
    });
  }

  const featuredEvent = {
    eventSlug: slug,
    eventName: event.title,
    startDate,
    finishDate,
    featuredDays,
    amount: featuredEventAmount,
    refId: tx_ref
  };

  const newFeauturedEvent = await FeaturedEvents.create(featuredEvent);
  Event.increment({ popularityCount: 2 }, { where: { slug } });
  return res.status(200).send({
    message: 'Featured event is created successfully',
    data,
    newFeauturedEvent,
    event
  });
};

export default createFeaturedEvent;
