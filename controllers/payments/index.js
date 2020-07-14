import models from '../../models';
import Flutterwave from 'flutterwave-node-v3';
import random from 'lodash.random';


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
  

  const ftw = new Flutterwave(public_key, public_secret, false);
  const {
    amount,
    email,
    phone_number,
    currency,
    fullname,
    network
  } = req.body;

  const tx_ref= 'GAT-' + random(100000000, 200000000);
  const redirect_url = 'https://rentalsug.com/'

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

