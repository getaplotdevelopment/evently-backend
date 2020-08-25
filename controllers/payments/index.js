import models from '../../models';

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
