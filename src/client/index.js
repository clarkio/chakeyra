// https://hipsum.co/api/?type=hipster-centric&sentences=1

let chatWords = '';
let chatCharacters = '';
let streamerWords = '';
let streamerCompletedCharacters = '';
let chatCompletedCharacters = '';
let streamerDone = false;
let chatDone = false;
let keyCaptureInterval;
let keyCaptureEnabled = true;
let streamerFirstKey = true;
let chatFirstKey = true;
let streamerStartTime;
let chatStartTime;
let isGameEnabled = false;

function startGame() {
  isGameEnabled = true;
  startGameForChat();
  document.addEventListener('keydown', captureKey);
  startKeyCaptureDelay();

  axios.get('https://hipsum.co/api/?type=hipster-centric&sentences=1')
    .then(response => {
      document.getElementById('start').disabled = true;

      streamerWords = response.data[0];
      console.log('streamer: ', streamerWords.length);
      document.getElementById('streamer-words').innerHTML = streamerWords;
      streamerCharacters = streamerWords.split('');

      let tempChatWords = response.data[0];
      // TODO: make the slice amount configurable
      chatWords = tempChatWords.split(' ').slice(0, 2).join('_');
      console.log('chat: ', chatWords.length);

      document.getElementById('chat-words').innerHTML = chatWords
      chatCharacters = chatWords.split('');
    });
}

function startKeyCaptureDelay() {
  keyCaptureInterval = setInterval(() => {
    keyCaptureEnabled = !keyCaptureEnabled;
  }, 350);
}

function stop() {
  document.removeEventListener('keydown', captureKey);
  document.getElementById('start').disabled = false;
  clearInterval(keyCaptureInterval);
  resetWordStuff();
  streamerStartTime = undefined;
  chatStartTime = undefined;
  isGameEnabled = false;
  // emit end game socket event
}

function resetWordStuff() {
  chatWords = '';
  chatCharacters = '';
  streamerWords = '';
  streamerCharacters = '';
  streamerCompletedCharacters = '';
  chatCompletedCharacters = '';
  streamerFirstKey = true;
  chatFirstKey = true;
}

function captureKey(event) {
  const key = event.key;
  const streamerWordsElement = document.getElementById('streamer-words');
  if (streamerFirstKey) {
    streamerFirstKey = false;
    // start streamer timer
    streamerStartTime = Date.now();
  }
  if (key === streamerCharacters[0]) {
    streamerCompletedCharacters += streamerCharacters[0];
    streamerCharacters.shift();
    streamerWords = streamerWords.substr(1);

    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span>${streamerWords}`;

    streamerWordsElement.innerHTML = updatedWords;
    streamerDone = streamerWords.length === 0;
    if (streamerDone) {
      streamerFirstKey = true;
      console.log(`Streamer finished in ${(Date.now() - chatStartTime) / 1000} seconds`);
    }
  } else {
    const updatedWords = `<span class="correct">${streamerCompletedCharacters}</span><span class="incorrect">${streamerWords.substr(0, 1)}</span>${streamerWords.substr(1)}`;
    streamerWordsElement.innerHTML = updatedWords;
  }
}
