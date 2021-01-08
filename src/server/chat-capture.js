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
    var user = extra.userId;
    // check if the array already has the user
    let userAlreadyAPlayer = usersInfos.find(u => u.userId == user);
    if (userAlreadyAPlayer) {
      console.log(`user infos already has ${user}`)
    } else {
      getUserInfo(user)
    }
  }
}

function sendChatKey(message) {
  serverSocket.emit('chatkey', message);
}

async function getUserInfo(userId) {
  var user = await getUserProfile(userId, TwitchAuthBearerToken)
    .then(user => {
      usersInfos.push(user);
      players.push(user);
      serverSocket.emit('newPlayerInfo', user, usersInfos)
      return user;
    })
    .catch(err => {
      console.log(err);
    });
  return user;
}
