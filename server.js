var fs = require('fs');
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, function listening() {
  console.log('Listening...');
});

// Get Data from JSON
var data = fs.readFileSync('wordlist.json');
var words = JSON.parse(data);

// Returns all endpoints
app.get('/', function returnEndPoints(request, response) {
  var reply = {
    getAllWords: '/all',
    searchWord: '/search/<query>',
    addWord: '/add/<word>/<score>',
    addWordGUI: '/gui'
  }
  response.send(reply);
});

// Returns static website folder
app.use('/gui', express.static('website'));

// Adds word to json
app.get('/add/:word/:score?', function addWord(request, response) {
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
    fs.writeFile('wordlist.json', data, finsihed);

    function finsihed(error) {
      var reply = {
        word: word,
        score: score,
        status: 'succes'
      }
      response.send(reply);
    }
  }
});

// Returns all words
app.get('/all', function sendAll(request, response) {
  var data = {
    words: words
  }
  response.send(data);
});

app.get('/search/:word/', function searchWord(request, response) {
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
});