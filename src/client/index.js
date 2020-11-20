// https://hipsum.co/api/?type=hipster-centric&sentences=1

const socket = io();

// let chatWords = '';
let chatWords = [];
let chatCompletedWords = [];
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

      streamerWords = response.data[0].replace('.', '');
      console.log('streamer: ', streamerWords.length);
      document.getElementById('streamer-words').innerHTML = streamerWords;
      streamerCharacters = streamerWords.split('');

      // let tempChatWords = response.data[0];
      let tempChatWords = streamerWords;
      // TODO: make the slice amount configurable
      // chatWords = tempChatWords.split(' ').slice(0, 2).join('_');
      // The following is if we want to try and let chat enter full words instead
      chatWords = tempChatWords.split(' ');
      console.log('chat: ', chatWords.length);

      document.getElementById('chat-words').innerHTML = chatWords.join(' ');
      // chatCharacters = chatWords.split('');
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
  socket.emit('endgame');
}

function resetWordStuff() {
  // chatWords = '';
  chatWords = [];
  chatCompletedWords = [];
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
