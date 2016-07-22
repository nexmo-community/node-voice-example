var config = require('./config');
var request = require('request');
var libphonenumber = require('libphonenumber');

var app = require('express')();
app.set('port', (config.port || 5000));
app.set('view engine', 'ejs');
app.use(require('body-parser').json());

/**
 * Serve the index view
 */
app.get('/', function(req, res) {
  res.render('index', {
    pubNubSubKey: config.pubNubSubKey,
    inboundNumber: libphonenumber.intl(config.inboundNumber, config.inboundNumberCountryCode)
  });
});

var CallTracker = require('./lib/CallTracker');
var callTracker = new CallTracker(config);

/**
 * Handle voice event webhooks
 */
app.post('/event', function(req, res) {
  callTracker.event(req.body);
});

/**
 * Calls the number in the :number parameter
 */
app.get('/call/:number', function(req, res) {
  var number = req.param.number;
  callTracker.call(number, function(result) {
    res.json(result);
  });
})

/**
 * Return an NCCO to instruct the Nexmo platform to
 * talk when the call is answered.
 */
app.get('/talk', function(req, res) {
  var ncco = callTracker.talk();
  res.json(ncco);
})

/**
 * Webhook endpoint to handle a call being answered.
 * Return an NCCO to record a call and proxy it to another number.
 */
app.get('/answer', function(req, res) {
  var from = req.query.from;
  var to = req.query.to;
  
  var ncco = callTracker.answer(from, to);
  return res.json(ncco);
});

/**
 * Webhook endpoint to be called when the call recording
 * has completed.
 */
app.post('/recording', function(req, res) {
  var from = req.query.from;
  var to = req.query.to;
  var recordingUrl = req.body.recording_url;
  
  callTracker.recording(from, to, recordingUrl);
  
  res.sendStatus(204);
});

/**
 * Route to play the recording with the given ID.
 * The endpoint hides that the Nexmo API key and API secret
 * is required to download the MP3 recording.
 */
app.get('/play/:id', function(req, resp) {
  var url = callTracker.getRecordingUrl(req.params.id);

  request({
    url: url,
    encoding: null
  }, function(err, res, body) {
    resp.set({'Content-Type': 'audio/mpeg'});
    resp.send(body);
  })
})

app.listen(app.get('port'), function() {
  console.log('Example app listening on port', app.get('port'));
});
