"use strict";

const dmForm = document.getElementById('dm-form');
const feedback = document.querySelector('.outputFeedback');
const chatDirectMessages = document.querySelector('.chat-direct-messages');
const contact = document.getElementById('receiver');
const {
  name,
  myName
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
let timeout;
const socket = io();

if (myName) {
  window.localStorage.setItem('myName', myName);
} // One to one chat


if (name) {
  const sender = localStorage.getItem('myName');
  socket.emit('oneToOne', {
    sender,
    receiver: name
  });
} // fetch DMs
// dmForm.addEventListener('submit', e => {
//   e.preventDefault();
//   const sender = localStorage.getItem('myName');
//   // get message text
//   const msg = e.target.elements.msg.value;
//   // Emit a dm message to the server
//   socket.emit('directMessage', {
//     msg,
//     sender
//   });
//   // // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });


socket.on('directMessage', message => {
  console.log('message', message);
  outputMessage(message); // scroll down

  chatDirectMessages.scrollTop = chatDirectMessages.scrollHeight;
}); // feedback from server

socket.on('action', action => {
  outputUserFeedback(action);
}); // Feedback submit

function timeoutFunction() {
  socket.emit('dmFeedback', false);
} // dmForm.addEventListener('keypress', () => {
//   // Emit a feedback to the server
//   socket.emit('dmFeedback', 'is typing...');
//   clearTimeout(timeout);
//   timeout = setTimeout(timeoutFunction, 2000);
// });
// OutputMessage function to Dom


function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector('.chat-direct-messages').appendChild(div);
} // Add reciver to dom
// OutputMessage the feedback to Dom


function outputUserFeedback(message) {
  if (message.text) {
    feedback.innerHTML = `<p>${message.username} ${message.text}</p>`;
  } else {
    feedback.innerHTML = '';
  }
}

function outputReceiver(receiver) {
  contact.innerHTML = `<strong>${receiver}</strong> `;
}