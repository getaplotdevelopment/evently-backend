console.log('Service Worker Loaded...');

self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('Push Recieved...');
  console.log('data', data);
  self.registration.showNotification(data.title, {
    body: 'Notified by Evently!',
    icon: 'http://image.ibb.co/frYOFd/tmlogo.png'
  });
});
