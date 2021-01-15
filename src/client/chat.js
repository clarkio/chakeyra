let playCount = 0;

socket.on('chatkey', (word) => {
  if (!isGameEnabled) {
    return;
  }

  if (chatFirstKey) {
    chatFirstKey = false;
    // start chat timer
    chatStartTime = Date.now();
  }

  const chatWordsElement = document.getElementById('chat-words');
  console.log(word);
  if (word === chatWords[0]) {
    //chatCompletedCharacters += chatCharacters[0];
    chatCompletedWords.push(chatWords[0]);
    // chatCharacters.shift();
    chatWords.shift();
    // chatWords = chatWords.substr(1);
    chatDone = chatWords.length === 0;

    const updatedChatWords = `<span class="correct">${chatCompletedWords.join(' ')}</span> ${!chatDone ? chatWords.join(' ') : ''}`;

    chatWordsElement.innerHTML = updatedChatWords;

    if (chatDone) {
      chatFirstKey = true;
      console.log(`Chat finished in ${(Date.now() - chatStartTime) / 1000} seconds`);
    }
  } else {
    if (!chatDone) {
      const updatedChatWords = `<span class="correct">${chatCompletedWords.join(' ')}</span> <span class="incorrect">${chatWords[0]}</span> ${chatWords.slice(1).join(' ')}`;
      chatWordsElement.innerHTML = updatedChatWords;
    }
  }
});

socket.on('newPlayer', (userInfo) => {
  if (!userInfo) return;

  playCount++
  const playerList = document.getElementById('player-area');

  const profileImageContainer = document.createElement('div');
  profileImageContainer.className = 'profileImageContainer';

  const playerCount = document.getElementById('playerCountInfo');
  playerCount.innerText = playCount < 2 ? `${playCount} player` : `${playCount} players`;

  const nameTag = document.createElement('div');
  nameTag.className = 'nameTag';
  nameTag.innerText = userInfo.displayName;

  const img = document.createElement('img');
  img.className = 'playerImage';
  img.src = userInfo.profileImageUrl;
  img.alt = userInfo.displayName;
  img.title = userInfo.displayName;
  profileImageContainer.appendChild(img);
  profileImageContainer.appendChild(nameTag);
  playerList.appendChild(profileImageContainer);
});

function startGameForChat() {
  socket.emit('startgame');
}
