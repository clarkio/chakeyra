const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const chatCapture = require('./chat-capture');
const { getTwitchAccessToken } = require('./TwitchHelpers');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const channel = process.env.TWITCH_CHANNEL_ID;

dotenv.config();

app.use(express.static(path.resolve(`${__dirname}`, '../client')));

app.get('/', function (req, res) {
  res.render('/index');
});

io.on('connection', (socket) => {
  socket.on('startgame', () => {
    chatCapture.startGame();
  });
  socket.on('endgame', () => {
    chatCapture.endGame();
  });
});

getTwitchAccessToken()
  .then((token) => {
    let accessToken;
    const server = http.listen(port, function (error) {
      if (error) throw error;
      console.clear();
      console.log(`The server is running: http://localhost:${port}`);
      console.log(`Connecting to channel: ${channel}`);
      accessToken = token.data.access_token;
      chatCapture.connect(io, channel, accessToken);
      module.exports = server;
    });
  })
  .catch((error) => console.error(error));
