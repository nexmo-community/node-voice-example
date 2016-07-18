var Nexmo = require('nexmo');
var ClientEmitter = require('./ClientEmitter');

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

CallTracker.prototype.answer = function (from, to) {
  // TODO: Build NCCO
  
  return null;
};

CallTracker.prototype.event = function(evt) {
  this.clientEmitter.emit('call', evt);
};

CallTracker.prototype.recording = function(from, to, recordingUrl) {
  // TODO: Build download url
  
  // TODO: Send SMS with download url
  
  this.clientEmitter.emit('call', {message: message});
};

CallTracker.prototype.getRecordingUrl = function(id) {
  return null;
};

module.exports = CallTracker;
