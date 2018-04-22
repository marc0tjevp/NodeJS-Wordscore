var fs = require('fs');
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listening);

var data = fs.readFileSync('additional.json');
var afinndata = fs.readFileSync('afinn.json');
var words = JSON.parse(data);
var afinn = JSON.parse(afinndata);

function listening() {
  console.log('Listening...');
}

app.use(express.static('website'));

app.get('/add/:word/:score?', addWord);

function addWord(request, response) {
  var data = request.params;
  var word = data.word;
  var score = Number(data.score);

  if (!score) {
    var reply = {
      status: 'Score is required'
    }
    response.send(reply);
  } else {

    words[word] = score;
    var data = JSON.stringify(words, null, 2);
    fs.writeFile('additional.json', data, finsihed);

    function finsihed(error) {
      var reply = {
        word: word,
        score: score,
        status: 'succes'
      }
      response.send(reply);
    }
  }
}

app.get('/all', sendAll);;

function sendAll(request, response) {
  var data = {
    additional: words,
    afinn: afinn
  }
  response.send(data);
}

app.get('/search/:word/', searchWord);

function searchWord(request, response) {
  var word = request.params.word;
  var reply = "";

  if (words[word]) {
    reply = {
      status: 'found',
      word: word,
      score: words[word]
    }
  } else {
    reply = {
      status: 'not found',
      word: word
    }
  }
  response.send(reply);
}