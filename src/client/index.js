

// https://hipsum.co/api/?type=hipster-centric&sentences=1

const requestHipsumWords = new XMLHttpRequest();

requestHipsumWords.open('GET', 'https://hipsum.co/api/?type=hipster-centric&sentences=1');

requestHipsumWords.onload = function () {
  console.log(this.responseText);
  
}

function getWords() {
  requestHipsumWords.send();
}
