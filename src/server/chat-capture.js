const ComfyJS = require('comfy.js');
const { getUserProfile } = require('./TwitchHelpers')

let gameStarted = false;
let serverSocket;
let players = [];
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
}

function chatHandler(user, message, flags, self, extra) {
  if (gameStarted) {
    if (reee.test(message) && players.find(player => player.displayName.toLowerCase() === user.toLowerCase())) {
      sendChatKey(message);
    }
  }
}

async function commandHandler(chatUsername, command, message, flags, chatUserInfo) {
  if (command === 'join') {
    if (players.find(player => player.displayName.toLowerCase() === chatUsername.toLowerCase())) return;

    const twitchUserInfo = await getUserInfo(chatUserInfo.userId);
    if (twitchUserInfo) {
      players.push(twitchUserInfo);
      serverSocket.emit('newPlayer', twitchUserInfo);
    }
  }
}

function sendChatKey(message) {
  serverSocket.emit('chatkey', message);
}

async function getUserInfo(userId) {
  try {
    return await getUserProfile(userId, TwitchAuthBearerToken);
  } catch (error) {
    console.error(error);
    return;
  }
}
