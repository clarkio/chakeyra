

// https://hipsum.co/api/?type=hipster-centric&sentences=1

let streamerWords = '';
let streamerCharacters = '';
let streamerCompletedCharacters = '';
let chatWords = '';
let streamerDone = false;
let chatDone = false;

function getWords() {
  document.addEventListener('keydown', captureKey);
  axios.get('https://hipsum.co/api/?type=hipster-centric&sentences=1')
    .then(response => {
      document.getElementById('streamer-words').innerHTML = response.data[0];
      document.getElementById('chat-words').innerHTML = response.data[0];
      streamerWords = response.data[0];
      chatWords = response.data[0];
      streamerCharacters = streamerWords.split('');
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
