const socket = io();

socket.on('chatkey', (key) => {
  const chatWordsElement = document.getElementById('chat-words');
  console.log(key);
  if (key === chatCharacters[0]) {
    chatCompletedCharacters += chatCharacters[0];
    chatCharacters.shift();
    chatWords = chatWords.substr(1);

    const updatedWords = `<span class="correct">${chatCompletedCharacters}</span>${chatWords}`;

    chatWordsElement.innerHTML = updatedWords;
    streamerDone = chatWords.length === 0;
  } else {
    const updatedWords = `<span class="correct">${chatCompletedCharacters}</span><span class="incorrect">${chatWords.substr(0, 1)}</span>${chatWords.substr(1)}`;
    chatWordsElement.innerHTML = updatedWords;
  }
});

function startGameForChat() {
  socket.emit('startgame');
}
