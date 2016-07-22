var Nexmo = require('nexmo');
var ClientEmitter = require('./ClientEmitter');

var sign = require('./JwtSigner');
var fs = require('fs');
var request = require('request');

/**
 *
 */
function CallTracker(config) {
  this.config = config;

  this.nexmo = new Nexmo({
      apiKey: this.config.nexmoApiKey, 
      apiSecret: this.config.nexmoApiSecret
    },
    {debug: true}
  );
  
  this.clientEmitter = new ClientEmitter(config);
  
  this.DOWNLOAD_URL_PREFIX = `https://api.nexmo.com/media/download?&api_key=${this.config.nexmoApiKey}&api_secret=${this.config.nexmoApiSecret}`;
}

/**
 * Make an outbound call to the given number
 */
CallTracker.prototype.call = function(number, cb) {
  var key = fs.readFileSync(this.config.keyFile);
  var jwt = sign(key, this.config.applicationId);
  
  request({
    url: 'https://api.nexmo.com/beta/calls',
    method: 'post',
    auth: {
      bearer: jwt
    },
    json: {
      to: [{
        type: 'phone',
        number: '16506309132'
      }],
      from: {
        type: 'phone',
        number: this.config.inboundNumber
      },
      answer_url: [`${this.config.base}/talk`],
      event_url: [`${this.config.base}/event`],
    }
  }, function(err, res, body) {
    cb(body);
  });
};

/**
 * Build a talk NCCO
 */
CallTracker.prototype.talk = function() {
  var ncco = [];
  
  var talkAction = {
    action: 'talk',
    text: 'Hello from Nexmo. Hope you are lovin Las Vegas'
  };
  ncco.push(talkAction);
  
  return ncco;
};

/**
 * Build an NCCO that records and proxies a call.
 */
CallTracker.prototype.answer = function (from, to) {
  var ncco = [];
  
  var recordAction = {
    action: 'record',
    eventUrl: [`${this.config.base}/recording?from=${from}&to=${to}`]
  };
  ncco.push(recordAction);
  
  var connectAction = {
    action: 'connect',
    from: this.config.inboundNumber,
    endpoint: [{
      type: 'phone',
      number: this.config.proxyToNumber // '15592023848'
    }],
    eventUrl: [`${this.config.base}/event`]
  };
  ncco.push(connectAction);
  
  return ncco;
};

/**
 * Handle the inbound event by pushing to the clientEmitter
 */
CallTracker.prototype.event = function(evt) {
  this.clientEmitter.emit('call', evt);
};

/**
 * Handle the recording completion
 */
CallTracker.prototype.recording = function(from, to, recordingUrl) {
  // Take the recording download ID from the end of the URL
  var id = recordingUrl.split('=')[1];
  
  // Build play URL to hide the API key and secret
  var url = `${this.config.base}/play/${id}`;
  
  // Send an SMS to the call so they can listen to their message
  var message = `From ${from} to ${to}. Listen ${url}`;
  this.nexmo.message.sendSms(this.config.inboundNumber, from, message);
  
  this.clientEmitter.emit('call', {message: message});
};

/**
 * Building the recording URL containing the Nexmo API key and secret
 */
CallTracker.prototype.getRecordingUrl = function(id) {
  var url = `${this.DOWNLOAD_URL_PREFIX}&id=${id}`;
  return url;
};

module.exports = CallTracker;
