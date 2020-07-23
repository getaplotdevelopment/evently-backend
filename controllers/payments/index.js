
import models from '../../models';

const { PaymentRequests } = models;

export const webhookPath = async(req, res) => {
  
  const requestJson = req.body;

  const newRequest = {
    verificationId: requestJson.id,
    refId: requestJson.tx_ref,
    status: requestJson.status,
    amount: requestJson.charged_amount,
    createdAt: requestJson.created_at,
    eventStatus: requestJson.event,
    customer: requestJson.customer,
    paymentType: requestJson.payment_type
  };

  const data = await PaymentRequests.create(newRequest);

  res.sendStatus(200);
};
