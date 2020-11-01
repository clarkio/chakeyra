const ComfyJS = require('comfy.js');

let gameStarted = false;
let serverSocket;

module.exports = {
  connect,
  startGame
};

function connect(server) {
  serverSocket = server;
  ComfyJS.onChat = chatHandler;
  ComfyJS.Init('clarkio');
}

function startGame() {
  gameStarted = true;
}

function chatHandler(user, message, flags, self, extra) {
  if (gameStarted) {
    if (message.length === 1) {
      sendChatKey(message);
    }
  }
}

function sendChatKey(message) {
  serverSocket.emit('chatkey', message);
}
