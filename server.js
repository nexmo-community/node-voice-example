var config = require('./config');
var request = require('request');

var app = require('express')();
app.set('port', (config.port || 5000));
app.set('view engine', 'ejs');
app.use(require('body-parser').json());

app.get('/', function(req, res) {
  res.render('index', {
    pubNubSubKey: config.pubNubSubKey,
    inboundNumber: config.inboundNumber
  });
});

// TODO: answer route

// TODO: recording route

// TODO: playback route

app.listen(app.get('port'), function() {
  console.log('Example app listening on port', app.get('port'));
});
