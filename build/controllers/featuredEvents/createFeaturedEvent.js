"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash.random");

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _finOneHelper = require("../../helpers/finOneHelper");

var _finOneHelper2 = _interopRequireDefault(_finOneHelper);

var _getSingleEvent = require("../../helpers/eventHelper/getSingleEvent");

var _getSingleEvent2 = _interopRequireDefault(_getSingleEvent);

var _timeConverter = require("../../helpers/timeConverter");

var _featuredEvent = require("../../constants/featuredEvent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  FeaturedEvents,
  PaymentRequests,
  Event
} = _index2.default;
const {
  PUBLIC_SECRET,
  enckey,
  FLUTTERWAVE_URL
} = process.env;

const createFeaturedEvent = async (req, res) => {
  const {
    email,
    phoneNumber,
    firstName,
    lastName,
    id: user
  } = req.user;
  const {
    eventObj
  } = req;
  const {
    organizer
  } = eventObj;
  const tx_ref = `GAT-${(0, _lodash2.default)(100000000, 200000000)}`;
  const {
    slug
  } = req.params;
  const {
    startDate,
    finishDate,
    currency
  } = req.body;
  const oneEvent = await (0, _getSingleEvent2.default)(slug);
  const singleRequest = await (0, _finOneHelper2.default)(PaymentRequests, {
    event: slug
  });
  const featuredDaysTimestamp = (0, _timeConverter.unixDateConverter)(finishDate) - (0, _timeConverter.unixDateConverter)(startDate);
  let featuredDays;

  if (featuredDaysTimestamp !== 0) {
    featuredDays = Math.round(featuredDaysTimestamp / 86400);
  } else {
    featuredDays = 1;
  }

  const featuredEventAmount = _featuredEvent.FEATURED_EVENT_AMOUNT_PER_DAY * featuredDays;
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
  const hostedLink = await (0, _axios2.default)({
    url: `${FLUTTERWAVE_URL}payments`,
    method: 'post',
    data: payload,
    headers: {
      Authorization: `Bearer ${PUBLIC_SECRET}`
    }
  });
  const {
    data
  } = hostedLink;
  const alreadyFeaturedEvent = await (0, _finOneHelper2.default)(FeaturedEvents, {
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
    await PaymentRequests.update({
      refId: tx_ref,
      expireBy: finishDate
    }, {
      where: {
        event: slug
      },
      returning: true,
      plain: true
    });
  } else {
    await PaymentRequests.create(requestData);
  }

  const event = await oneEvent.update({
    isFeatured: true
  }, {
    where: {
      slug
    },
    returning: true,
    plain: true
  });

  if (alreadyFeaturedEvent) {
    const newFeauturedEvent = await alreadyFeaturedEvent.update({
      startDate,
      finishDate,
      featuredDays,
      amount: featuredEventAmount
    }, {
      where: {
        eventSlug: slug
      }
    });
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
  return res.status(200).send({
    message: 'Featured event is created successfully',
    data,
    newFeauturedEvent,
    event
  });
};

exports.default = createFeaturedEvent;