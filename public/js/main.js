/* eslint-disable require-jsdoc */
// import io from 'forumSocket.io';
// import { JOIN_ROOM_FORUM } from '../../constants/forum/groupMessage';

const chatForm = document.getElementById('chat-form');
const feedback = document.querySelector('.outputFeedback');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');

const userList = document.getElementById('users');
let timeout;

// Get username and room from URL

const { username, userId } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const forumSocket = io('/forum');
const socket = io();
// Join chatroom
forumSocket.emit('JOIN_ROOM_FORUM', {
  user: {
    username,
    userId
  }
});

// Get room and users
forumSocket.on('GET_ROOM_USERS', ({ room, users }) => {
  console.log('or here', users);
  outputRoomName(room);
  outputUsers(users);
});
socket.on('GET_ROOM_USERS', ({ room, users }) => {
  console.log('here', users);
  outputRoomName(room);
  outputUsers(users);
});

forumSocket.on('MESSAGE_CHAT_FORUM', message => {
  console.log('message', message);
  outputMessage(message);
  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// feedback from server

// forumSocket.on('action', action => {
//   outputUserFeedback(action);
// });

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // get message text

  const msg = e.target.elements.msg.value;

  // Emit a message to the server
  forumSocket.emit('MESSAGE_CHAT_FORUM', msg);

  // Clear input

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Feedback submit

// function timeoutFunction() {
//   forumSocket.emit('feedback', false);
// }

// chatForm.addEventListener('keypress', () => {
//   // Emit a feedback to the server
//   forumSocket.emit('feedback', 'is typing...');
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

  document.querySelector('.chat-messages').appendChild(div);
}

// OutputMessage the feedback to Dom
function outputUserFeedback(message) {
  if (message.text) {
    feedback.innerHTML = `<p>${message.username} ${message.text}</p>`;
  } else {
    feedback.innerHTML = '';
  }
}

// Add room name to Dom

function outputRoomName(room) {
  roomName.innerHTML = room;
}

// Add users to dom

function outputUsers(users) {
  if (users !== null) {
    userList.innerHTML = `
  ${users.map(user => `<li>${user.firstName}</li>`).join('')}
  `;
  }
}
