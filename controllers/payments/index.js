/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import random from 'lodash.random';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import models from '../../models';
import generateVCode from '../../helpers/payment/vcode';
import generateQRCodeHelper from '../../helpers/payment/qrCode';
import cloudinaryUploadPresetHelper from '../../helpers/fileUploadConfig/uploadPreset';

const {
  Event,
  PaymentEvents,
  PaymentRequests,
  Ticket,
  PaymentRefunds
} = models;
const { PUBLIC_SECRET, enckey, FLUTTERWAVE_URL, QR_BASE_URL } = process.env;

const verifyPayment = async payload => {
  const { verificationId } = payload;

  const transactionResponse = await PaymentRequests.findOne({
    where: { verificationId }
  });

  const {
    organizer,
    user,
    ticketIds: ticketNumbers,
    event,
    expireBy
  } = transactionResponse;

  const results = await axios({
    url: `${FLUTTERWAVE_URL}transactions/${verificationId}/verify`,
    method: 'GET',
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });

  const { data } = results.data;
  if (results.status === 200) {
    for (const ticketNo of ticketNumbers) {
      const vCode = generateVCode();
      const paidPayload = {
        paymentID: uuidv4(),
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

      const qrCode = await generateQRCodeHelper([paidPayload]);

      const uploadedResponse = await cloudinaryUploadPresetHelper(
        qrCode,
        'evently'
      );

      const paymentsCreated = [];

      const { dataValues } = await PaymentEvents.create({
        ...paidPayload,
        qrCode: `${QR_BASE_URL}${uploadedResponse.version}/${uploadedResponse.public_id}.${uploadedResponse.format}`
      });
      paymentsCreated.push(dataValues);
      Event.increment({ popularityCount: 2 }, { where: { slug: event } });
      await Ticket.update(
        { status: 'booked' },
        {
          where: { ticketNumber: ticketNo, event }
        }
      );
    }
  } else {
    throw new Error(results);
  }
};

export const webhookPath = async (req, res) => {
  const requestJson = req.body;
  const { data } = requestJson;
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
    where: { refId: data.tx_ref },
    returning: true
  });
  const { dataValues } = updatedData;
  await verifyPayment(dataValues);

  res.sendStatus(200);
};

export const standardPayment = async (req, res) => {
  const tx_ref = `GAT-${random(100000000, 200000000)}`;
  const { id: user } = req.user;
  const { event, eventObj } = req;
  const { finishDate, organizer } = eventObj;

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
      status: "success"
    });
  }
  const hostedLink = await axios({
    url: `${FLUTTERWAVE_URL}payments`,
    method: 'post',
    data: payload,
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });
  const { data } = hostedLink;
  return res.status(200).send(data);
};

export const usersPaidForEvent = async (req, res) => {
  const { slug } = req.params;

  const { count, rows: data } = await PaymentEvents.findAndCountAll({
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

export const eventAttendees = async (req, res) => {
  const { slug } = req.params;
  const { count, rows: data } = await PaymentEvents.findAndCountAll({
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

export const attendFree = async (req, res) => {
  const { username, phone_number, email, ticket_ids } = req.body;
  const { event, organizerEmail, eventObj } = req;
  const { id: user } = req.user;
  const paymentsCreated = [];
  for (const ticket_id of ticket_ids) {
    const vCode = generateVCode();
    const freePayload = {
      paymentID: uuidv4(),
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

    const qrCode = await generateQRCodeHelper([freePayload]);

    const uploadedResponse = await cloudinaryUploadPresetHelper(
      qrCode,
      'evently'
    );

    const { dataValues } = await PaymentEvents.create({
      ...freePayload,
      qrCode: `${QR_BASE_URL}${uploadedResponse.version}/${uploadedResponse.public_id}.${uploadedResponse.format}`
    });
    paymentsCreated.push(dataValues);

    Event.increment({ popularityCount: 2 }, { where: { slug: event } });
    await Ticket.update(
      { status: 'booked' },
      {
        where: { ticketNumber: ticket_id, event }
      }
    );
  }
  res.send({
    message: 'success',
    data: paymentsCreated
  });
};

export const cancelFreeAttendance = async (req, res) => {
  const { event } = req;
  const { ticketId } = req.params;
  const { dataValues } = await PaymentEvents.update(
    { attendanceStatus: false },
    {
      where: {
        ticketNo: ticketId,
        event
      }
    }
  );
  await Ticket.update(
    { status: 'available' },
    {
      where: { ticketNumber: ticketId, event }
    }
  );
  Event.decrement({ popularityCount: 1 }, { where: { slug: event } });
  res.send({
    status: 200,
    message: 'Attendance has been cancelled.'
  });
};

export const paymentRefund = async (req, res) => {
  const { amount } = req.body;
  const { paymentMethod, transactionID } = req.payment;

  if (paymentMethod === 'free') {
    return res.status(400).send({
      status: 400,
      message: 'No refunds for a free event'
    });
  }

  const results = await axios({
    url: `${FLUTTERWAVE_URL}transactions/${transactionID}/refund`,
    method: 'post',
    data: { amount },
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });
  const { data, status, message } = results.data;
  const refundObject = {
    ...req.payment,
    refundID: data.id,
    accountID: data.account_id,
    txID: data.tx_id,
    flwRef: data.flw_ref,
    walletID: data.wallet_id,
    amountRefunded: data.amount_refunded,
    status: data.status,
    meta: data.meta
  };
  const { dataValues } = await PaymentRefunds.create(refundObject);
  res.send({ status, message, dataValues });
};
