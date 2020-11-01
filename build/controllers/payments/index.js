"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paymentRefund = exports.cancelFreeAttendance = exports.attendFree = exports.eventAttendees = exports.usersPaidForEvent = exports.standardPayment = exports.webhookPath = undefined;

var _lodash = require("lodash.random");

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _uuid = require("uuid");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _vcode = require("../../helpers/payment/vcode");

var _vcode2 = _interopRequireDefault(_vcode);

var _qrCode = require("../../helpers/payment/qrCode");

var _qrCode2 = _interopRequireDefault(_qrCode);

var _uploadPreset = require("../../helpers/fileUploadConfig/uploadPreset");

var _uploadPreset2 = _interopRequireDefault(_uploadPreset);

var _finOneHelper = require("../../helpers/finOneHelper");

var _finOneHelper2 = _interopRequireDefault(_finOneHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */
const {
  Event,
  PaymentEvents,
  PaymentRequests,
  Ticket,
  PaymentRefunds,
  FeaturedEvents
} = _models2.default;
const {
  PUBLIC_SECRET,
  enckey,
  FLUTTERWAVE_URL,
  QR_BASE_URL
} = process.env;

const verifyPayment = async payload => {
  const {
    verificationId
  } = payload;
  const transactionResponse = await PaymentRequests.findOne({
    where: {
      verificationId
    }
  });
  const {
    organizer,
    user,
    ticketIds: ticketNumbers,
    event,
    expireBy
  } = transactionResponse;
  const results = await (0, _axios2.default)({
    url: `${FLUTTERWAVE_URL}transactions/${verificationId}/verify`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PUBLIC_SECRET}`
    }
  });
  const {
    data
  } = results.data;

  if (results.status === 200) {
    for (const ticketNo of ticketNumbers) {
      const vCode = (0, _vcode2.default)();
      const paidPayload = {
        paymentID: (0, _uuid.v4)(),
        ticketNo,
        amount: data.amount,
        organizer,
        event,
        user,
        transactionID: data.id,
        attendanceStatus: true,
        customer: data.customer,
        paymentMethod: data.payment_type,
        refID: data.tx_ref,
        vCode,
        expireBy
      };
      const qrCode = await (0, _qrCode2.default)([paidPayload]);
      const uploadedResponse = await (0, _uploadPreset2.default)(qrCode, 'evently');
      const paymentsCreated = [];
      const {
        dataValues
      } = await PaymentEvents.create({ ...paidPayload,
        qrCode: `${QR_BASE_URL}${uploadedResponse.version}/${uploadedResponse.public_id}.${uploadedResponse.format}`
      });
      paymentsCreated.push(dataValues);
      Event.increment({
        popularityCount: 2
      }, {
        where: {
          slug: event
        }
      });
      await Ticket.update({
        status: 'booked'
      }, {
        where: {
          ticketNumber: ticketNo,
          event
        }
      });
    }
  } else {
    throw new Error(results);
  }
};

const webhookPath = exports.webhookPath = async (req, res) => {
  const requestJson = req.body;
  const {
    data
  } = requestJson;
  const newRequest = {
    verificationId: data.id,
    status: data.status,
    amount: data.charged_amount,
    createdAt: data.created_at,
    eventStatus: requestJson.event,
    customer: data.customer,
    paymentType: data.payment_type
  };
  const [rowCount, [updatedData]] = await PaymentRequests.update(newRequest, {
    where: {
      refId: data.tx_ref
    },
    returning: true
  });
  const featuredEvent = await (0, _finOneHelper2.default)(FeaturedEvents, {
    refId: data.tx_ref
  });

  if (featuredEvent) {
    await FeaturedEvents.update({
      verificationId: newRequest.verificationId,
      featuredStatus: true
    }, {
      where: {
        refId: data.tx_ref
      },
      returning: true
    });
  }

  const {
    dataValues
  } = updatedData;
  await verifyPayment(dataValues);
  res.sendStatus(200);
};

const standardPayment = exports.standardPayment = async (req, res) => {
  const tx_ref = `GAT-${(0, _lodash2.default)(100000000, 200000000)}`;
  const {
    id: user
  } = req.user;
  const {
    event,
    eventObj
  } = req;
  const {
    finishDate,
    organizer
  } = eventObj;
  const {
    currency,
    amount,
    fullname,
    email,
    phone_number,
    ticket_ids,
    redirect_url
  } = req.body;
  const payload = {
    currency,
    amount,
    payment_options: 'card',
    customer: {
      email,
      phone_number,
      name: fullname
    },
    customizations: {
      title: 'Evently',
      description: 'Evently is a real time social events listing mobile application',
      logo: 'https://res.cloudinary.com/evently/image/upload/q_auto,f_auto/v1603227097/asserts/eventlyF1_1_gtwpes.png'
    },
    tx_ref,
    redirect_url,
    enckey
  };
  const requestData = {
    user,
    ticketIds: ticket_ids,
    organizer: organizer.id,
    event,
    refId: tx_ref,
    expireBy: finishDate
  };
  await PaymentRequests.create(requestData);

  if (!redirect_url) {
    return res.status(200).send({
      message: 'Request from mobile app',
      status: 'success',
      refId: tx_ref
    });
  }

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
  return res.status(200).send(data);
};

const usersPaidForEvent = exports.usersPaidForEvent = async (req, res) => {
  const {
    slug
  } = req.params;
  const {
    count,
    rows: data
  } = await PaymentEvents.findAndCountAll({
    where: {
      event: slug
    }
  });
  return res.send({
    message: 'success',
    count,
    data
  });
};

const eventAttendees = exports.eventAttendees = async (req, res) => {
  const {
    slug
  } = req.params;
  const {
    count,
    rows: data
  } = await PaymentEvents.findAndCountAll({
    where: {
      event: slug,
      attendanceStatus: 'true'
    }
  });
  return res.send({
    message: 'success',
    count,
    data
  });
};

const attendFree = exports.attendFree = async (req, res) => {
  const {
    username,
    phone_number,
    email,
    ticket_ids
  } = req.body;
  const {
    event,
    organizerEmail,
    eventObj
  } = req;
  const {
    id: user
  } = req.user;
  const paymentsCreated = [];

  for (const ticket_id of ticket_ids) {
    const vCode = (0, _vcode2.default)();
    const freePayload = {
      paymentID: (0, _uuid.v4)(),
      amount: 0,
      organizer: organizerEmail.id,
      event,
      transactionID: null,
      attendanceStatus: true,
      paymentMethod: 'free',
      refID: 'free',
      ticketNo: ticket_id,
      user,
      vCode,
      expireBy: eventObj.finishDate,
      customer: {
        name: username,
        phone_number,
        email
      }
    };
    const qrCode = await (0, _qrCode2.default)([freePayload]);
    const uploadedResponse = await (0, _uploadPreset2.default)(qrCode, 'evently');
    const {
      dataValues
    } = await PaymentEvents.create({ ...freePayload,
      qrCode: `${QR_BASE_URL}${uploadedResponse.version}/${uploadedResponse.public_id}.${uploadedResponse.format}`
    });
    paymentsCreated.push(dataValues);
    Event.increment({
      popularityCount: 2
    }, {
      where: {
        slug: event
      }
    });
    await Ticket.update({
      status: 'booked'
    }, {
      where: {
        ticketNumber: ticket_id,
        event
      }
    });
  }

  res.send({
    message: 'success',
    data: paymentsCreated
  });
};

const cancelFreeAttendance = exports.cancelFreeAttendance = async (req, res) => {
  const {
    event
  } = req;
  const {
    ticketId
  } = req.params;
  const {
    dataValues
  } = await PaymentEvents.update({
    attendanceStatus: false
  }, {
    where: {
      ticketNo: ticketId,
      event
    }
  });
  await Ticket.update({
    status: 'available'
  }, {
    where: {
      ticketNumber: ticketId,
      event
    }
  });
  Event.decrement({
    popularityCount: 1
  }, {
    where: {
      slug: event
    }
  });
  res.send({
    status: 200,
    message: 'Attendance has been cancelled.'
  });
};

const paymentRefund = exports.paymentRefund = async (req, res) => {
  const {
    amount
  } = req.body;
  const {
    paymentMethod,
    transactionID
  } = req.payment;

  if (paymentMethod === 'free') {
    return res.status(400).send({
      status: 400,
      message: 'No refunds for a free event'
    });
  }

  const results = await (0, _axios2.default)({
    url: `${FLUTTERWAVE_URL}transactions/${transactionID}/refund`,
    method: 'post',
    data: {
      amount
    },
    headers: {
      Authorization: `Bearer ${PUBLIC_SECRET}`
    }
  });
  const {
    data,
    status,
    message
  } = results.data;
  const refundObject = { ...req.payment,
    refundID: data.id,
    accountID: data.account_id,
    txID: data.tx_id,
    flwRef: data.flw_ref,
    walletID: data.wallet_id,
    amountRefunded: data.amount_refunded,
    status: data.status,
    meta: data.meta
  };
  const {
    dataValues
  } = await PaymentRefunds.create(refundObject);
  res.send({
    status,
    message,
    dataValues
  });
};