const ComfyJS = require('comfy.js');

let gameStarted = false;
let serverSocket;
let players = [];

// regular expression to capture first word from chat message from viewer
// regex provided by @NickAndMartinLearnStuff
// const reee = /^[\w\-,\']+$/;
const reee = /^[^\s\.\?!]+$/;

module.exports = {
  connect,
  startGame,
  endGame
};

function connect(server) {
  serverSocket = server;
  ComfyJS.onChat = chatHandler;
  ComfyJS.onCommand = commandHandler;
  ComfyJS.Init('clarkio');
}

function startGame() {
  gameStarted = true;
}

function endGame() {
  gameStarted = false;
  players = [];
}

function chatHandler(user, message, flags, self, extra) {
  console.log(players.find(player => player === user));

  if (gameStarted) {
    // if (message.length === 1 && players.find(player => player === user)) {
    //   sendChatKey(message);
    // }
    if (reee.test(message) && players.find(player => player === user)) {
      sendChatKey(message);
    }
  }
}

function commandHandler(user, command, message, flags, extra) {
  if (command === 'join' && !players.find(player => player === user)) {
    players.push(user);
  }
}

function sendChatKey(message) {
  serverSocket.emit('chatkey', message);
}
