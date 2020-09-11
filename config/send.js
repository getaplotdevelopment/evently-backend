import admin from 'firebase-admin';
import serviceAccount from '../evently-firebase.json';

// const serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://evently-264812.firebaseio.com'
});
