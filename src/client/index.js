// https://hipsum.co/api/?type=hipster-centric&sentences=1

let chatWords = '';
let chatCharacters = '';
let streamerWords = '';
let streamerCompletedCharacters = '';
let chatCompletedCharacters = '';
let streamerDone = false;
let chatDone = false;

function getWords() {
  startGameForChat();
  document.addEventListener('keydown', captureKey);
  axios.get('https://hipsum.co/api/?type=hipster-centric&sentences=1')
    .then(response => {
      document.getElementById('start').disabled = true;

      streamerWords = response.data[0];
      document.getElementById('streamer-words').innerHTML = streamerWords;
      streamerCharacters = streamerWords.split('');

      let tempChatWords = response.data[0];
      // Live stream chat rooms don't allow messages with only a space " " so replace spaces with "_" to get around it
      chatWords = tempChatWords.replace(/ /g, '_');

      document.getElementById('chat-words').innerHTML = chatWords
      chatCharacters = chatWords.split('');
    });
}

function stop() {
  document.removeEventListener('keydown', captureKey);
  document.getElementById('start').disabled = false;
  // emit end game socket event
}

function captureKey(event) {
  const key = event.key;
  const streamerWordsElement = document.getElementById('streamer-words');
  if (key === streamerCharacters[0]) {
    streamerCompletedCharacters += streamerCharacters[0];
    streamerCharacters.shift();
    streamerWords = streamerWords.substr(1);

    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span>${streamerWords}`;

    streamerWordsElement.innerHTML = updatedWords;
    streamerDone = streamerWords.length === 0;
  } else {
    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span><span class="incorrect">${streamerWords.substr(0, 1)}</span>${streamerWords.substr(1)}`;
    streamerWordsElement.innerHTML = updatedWords;
  }
}
