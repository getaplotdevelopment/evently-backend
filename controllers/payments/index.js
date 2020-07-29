import models from '../../models';
import random from 'lodash.random';
import axios from 'axios'

import { v4 as uuidv4 } from 'uuid';
const { Event, PaymentEvents, PaymentRequests } = models;

var TICKET_NO, EVENT_SLUG, ORGINIZER;

const verifyPayment = async (payload, public_secret) => {
  const verificationId = payload.verificationId
  console.log('verificationId', verificationId);
  console.log('TICKET_NO, EVENT_SLUG, ORGINIZER', TICKET_NO, EVENT_SLUG, ORGINIZER);
  
  
  const results = await axios({
    url: `https://api.flutterwave.com/v3/transactions/${verificationId}/verify`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + 'FLWSECK_TEST-f6f396b315ff0fd72a9c6b8f102859b0-X' }
  });  

  const { data }  = results.data
  console.log('verify response', data);

  if (results.status === 200) {
    const paidPayload = {
      paymentID: uuidv4(),
      ticketNo: TICKET_NO,
      amount: data.amount,
      organizer: ORGINIZER,
      event: EVENT_SLUG,
      transactionID: data.id,
      attendanceStatus: true,
      customer: data.customer,
      paymentMethod: data.payment_type,
      refID: data.tx_ref
    };
    const { dataValues } = await PaymentEvents.create(paidPayload)
    console.log('verify response created', dataValues);
  } else {
    throw new Error(err);
  }

};

export const webhookPath = async(req, res) => {
  const { public_secret } = req.headers;
  const requestJson = req.body;
  const { data } = requestJson;

  const newRequest = {
    verificationId: data.id,
    refId: data.tx_ref,
    status: data.status,
    amount: data.charged_amount,
    createdAt: data.created_at,
    eventStatus: requestJson.event,
    customer: data.customer,
    paymentType: data.payment_type
  };
  console.log(newRequest);

  const { dataValues } = await PaymentRequests.create(newRequest); 
  await verifyPayment(dataValues, public_secret)

  res.sendStatus(200);
};
  
const defineGlobals = () => {
  const tx_ref= 'GAT-' + random(100000000, 200000000);
  const redirect_url = 'https://rentalsug.com';
  return { tx_ref, redirect_url };
};

export const makePayment = async(req, res) => {
  const { public_secret, public_key } = req.headers;
  const { ftw, tx_ref, redirect_url} = await defineGlobals(public_key, public_secret, false);
 
  const {
    amount,
    email,
    phone_number,
    currency,
    fullname,
    network
  } = req.body;

  const payload = {
    tx_ref,
    amount,
    email,
    phone_number,
    currency,
    fullname,
    redirect_url,
    network
  }

  const response = await ugMobileMoney(ftw, payload);
  return res.send(response)
  
}

const ugMobileMoney = async(ftw, payload) => {
  const response = await ftw.MobileMoney.uganda(payload)
  console.log(response);
  
  return response
}

export const chargeCard = async (req, res) => {
  const { public_secret, public_key, enckey} = req.headers;
  const { ftw, tx_ref, redirect_url} = await defineGlobals(public_key, public_secret, true);
 

  const {
    card_number,
    cvv,
    expiry_month,
    expiry_year,
    currency,
    amount,
    fullname,
    email,
    phone_number
  } = req.body;

  const payload = {
    card_number,
    cvv,
    expiry_month,
    expiry_year,
    currency,
    amount,
    fullname,
    email,
    phone_number,
    tx_ref,
    redirect_url,
    enckey
  };

  const response = await ftw.Charge.card(payload);
  console.log(response);
  
}

export const standardPayment = async (req, res) => {
  const { public_secret, enckey} = req.headers;
  const tx_ref= 'GAT-' + random(100000000, 200000000);
  const redirect_url = 'https://rentalsug.com';  
  const { slug } = req.params;
  const { dataValues } = await Event.findOne({
    where: { slug }
  });

  if (dataValues) {
    ORGINIZER = dataValues.organizer;
    EVENT_SLUG = slug;
  }  

  const {
    currency,
    amount,
    fullname,
    email,
    phone_number,
    ticket_id
  } = req.body;

  TICKET_NO = ticket_id;

  const payload = {
    currency,
    amount,
    payment_options: 'card',
    customer: {
      email,
      phone_number,
      name: fullname,
    },
    customizations: {
      title: 'Get A Plot',
      description: 'awesome app',
      logo: 'https://assets.piedpiper.com/logo.png'
    },
    tx_ref,
    redirect_url,
    enckey
  };
  const hostedLink = await axios({
    url: 'https://api.flutterwave.com/v3/payments',
    method: 'post',
    data: payload,
    headers: { 'Authorization': 'Bearer ' + public_secret }
  });
  const { data } = hostedLink
  return res.status(200).send(data);
};

