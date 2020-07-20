import models from '../../models';
import Flutterwave from 'flutterwave-node-v3';
import random from 'lodash.random';
import axios from 'axios'


const { PaymentRequests } = models;

export const webhookPath = async (req, res) => {
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

  const dataObj = await PaymentRequests.create(newRequest);

  res.sendStatus(200);
};

export const makePayment = async(req, res) => {
  const { public_secret, public_key, encryption_key} = req.headers;
  console.log(req.headers);
  
const defineGlobals = (public_key, public_secret, status) => {
  const ftw = new Flutterwave(public_key, public_secret, status);
  const tx_ref= 'GAT-' + random(100000000, 200000000);
  const redirect_url = 'https://rentalsug.com';
  return { ftw, tx_ref, redirect_url };
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
  const { public_secret, public_key, enckey} = req.headers;
  const { ftw, tx_ref, redirect_url } = await defineGlobals(public_key, public_secret, true);

  const {
    currency,
    amount,
    fullname,
    email,
    phone_number
  } = req.body;

  const payload = {
    currency,
    transaction_id: '777777',
    amount,
    payment_options: 'card',
    customer: {
      email,
      phonenumber: phone_number,
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


  const response = await axios({
    url: 'https://api.flutterwave.com/v3/payments',
    method: 'post',
    data: payload,
    headers: { 'Authorization': 'Bearer ' + public_secret }
  }).then((res) => {
    // console.log(res);
    console.log('77777777777', req);
    
  }).catch((err) => {
    console.log(err);
    
  })

  // console.log('666666666', req);

  // console.log(response);
  


}

