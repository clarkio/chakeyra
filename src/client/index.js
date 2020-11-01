// https://hipsum.co/api/?type=hipster-centric&sentences=1

let chatWords = '';
let chatCharacters = '';
let streamerCompletedCharacters = '';
let chatCompletedCharacters = '';
let streamerDone = false;
let chatDone = false;

function getWords() {
  startGameForChat();
  document.addEventListener('keydown', captureKey);
  axios.get('https://hipsum.co/api/?type=hipster-centric&sentences=1')
    .then(response => {
      document.getElementById('streamer-words').innerHTML = response.data[0];

      let tempChatWords = response.data[0];
      // Live stream chat rooms don't allow messages with only a space " " so replace spaces with "_" to get around it
      chatWords = tempChatWords.replace(/ /g, '_');

      document.getElementById('chat-words').innerHTML = chatWords
      chatCharacters = chatWords.split('');
      document.getElementById('start').disabled = true;
    });
}

function stop() {
  document.removeEventListener('keydown', captureKey);
  document.getElementById('start').disabled = false;
}

function captureKey(event) {
  const key = event.key;
  const streamerWordsElement = document.getElementById('streamer-words');
  if (key === chatCharacters[0]) {
    streamerCompletedCharacters += chatCharacters[0];
    chatCharacters.shift();
    chatWords = chatWords.substr(1);

    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span>${chatWords}`;

    streamerWordsElement.innerHTML = updatedWords;
    streamerDone = chatWords.length === 0;
  } else {
    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span><span class="incorrect">${chatWords.substr(0, 1)}</span>${chatWords.substr(1)}`;
    streamerWordsElement.innerHTML = updatedWords;
  }
}
