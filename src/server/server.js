const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const chatCapture = require('./chat-capture');

const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(`${__dirname}`, '../client')));

app.get('/', function (req, res) {
  res.render('/index');
});

io.on('connection', (socket) => {
  socket.on('startgame', () => {
    chatCapture.startGame();
  });
});

const server = http.listen(port, function (error) {
  if (error) throw error;
  console.log(`The server is running: http://localhost:${port}`)
});

chatCapture.connect(io);

module.exports = server;
