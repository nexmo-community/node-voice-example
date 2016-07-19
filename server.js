var config = require('./config');
var request = require('request');
var libphonenumber = require('libphonenumber');

var app = require('express')();
app.set('port', (config.port || 5000));
app.set('view engine', 'ejs');
app.use(require('body-parser').json());

app.get('/', function(req, res) {
  res.render('index', {
    pubNubSubKey: config.pubNubSubKey,
    inboundNumber: libphonenumber.intl(config.inboundNumber, config.inboundNumberCountryCode)
  });
});

var CallTracker = require('./lib/CallTracker');
var callTracker = new CallTracker(config);

app.post('/event', function(req, res) {
  callTracker.event(req.body);
});

// TODO: call route

// TODO: talk route

// TODO: answer route

// TODO: recording route

// TODO: playback route

app.listen(app.get('port'), function() {
  console.log('Example app listening on port', app.get('port'));
});
