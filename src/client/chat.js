

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

socket.on('newPlayerInfo', (userData, userList) => {
  var playerList = document.getElementById('playerList');
  var img = document.createElement('img');
  img.className = 'playerImage';
  img.src = userData.profileImageUrl;
  if (userList.length > 0 && userData !== undefined) {
    var profileImageContainer = document.createElement('div');
    profileImageContainer.className = 'profileImageContainer';

    var playerCount = document.getElementById('playerCountInfo');
    playerCount.innerText = "";
    playerCount.innerText = userList.length < 2 ? `${userList.length} player` : `${userList.length} players`

    var nameTag = document.createElement('span');
    nameTag.className = 'nameTag';
    nameTag.innerText = userData.displayName;

    var img = document.createElement('img');
    img.className = 'playerImage';
    img.src = userData.profileImageUrl;
    img.alt = userData.displayName
    img.title = userData.displayName
    profileImageContainer.appendChild(img);
    profileImageContainer.appendChild(nameTag);
    playerList.appendChild(profileImageContainer);
  }
  else if (userList.length === 0) {
    var elementsToDelete = playerList.getElementsByClassName('profileImageContainer');
    while (elementsToDelete[0]) {
      elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
    }
  }
});

function startGameForChat() {
  socket.emit('startgame');
}
