import express from 'express';
import webpush from 'web-push';

const router = express.Router();

webpush.setVapidDetails(
  'mailto:jeandedieuam@gmail.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);
console.log('here');

// subscribe to the route
router.post('/subscribe', (req, res) => {
  console.log('here we go');
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: 'Push Test' });

  // Pass object into sendNotification
  console.log('subscription', subscription);
  webpush
    .sendNotification(subscription, 'work please')
    .catch(err => console.log('err', err));
});

export default router;
