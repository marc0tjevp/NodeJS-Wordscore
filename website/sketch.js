function setup() {
  createCanvas(300, 200);
  console.log('running');

  getWords();

  var button = select('#submit');
  button.mousePressed(submitWord);
}

function submitWord() {
  var word = select('#word').value();
  var score = select('#score').value();

  loadJSON('/add/' + word + '/' + score, finished);

  function finished(data) {
    console.log(data);
  }

}

function getWords() {
  var data = loadJSON('/all', function finished() {
    console.log(data.additional);
  })
}