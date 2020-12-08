const ComfyJS = require('comfy.js');
const { getUserProfile } = require('./TwitchHelpers')

let gameStarted = false;
let serverSocket;
let players = [];
let usersInfos = [];
let TwitchAuthBearerToken;

// regular expression to capture first word from chat message from viewer
// regex provided by @NickAndMartinLearnStuff
// const reee = /^[\w\-,\']+$/;
const reee = /^[^\s\.\?!]+$/;

module.exports = {
  connect,
  startGame,
  endGame
};

function connect(server, channel, accessToken) {
  serverSocket = server;
  TwitchAuthBearerToken = accessToken;
  ComfyJS.onChat = chatHandler;
  ComfyJS.onCommand = commandHandler;
  ComfyJS.Init(channel);
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
    getUserInfo(extra.userId)
    players.push(user);
  }
}

function sendChatKey(message) {
  serverSocket.emit('chatkey', message);
}

async function getUserInfo(userId) {
   await getUserProfile(userId, TwitchAuthBearerToken)
    .then(user => {
      usersInfos.push(user);
      serverSocket.emit('newPlayerInfo', user, usersInfos)
    })
    .catch(err => {
      console.log(err);
    });
}
