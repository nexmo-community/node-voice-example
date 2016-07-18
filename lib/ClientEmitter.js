var PubNub = require('pubnub');
var config = require('../config');

function ClientEmitter(config) {
  this.pubnub = PubNub({
      ssl           : true,
      publish_key   : config.pubNubPubKey,
      subscribe_key : config.pubNubSubKey
  });
}

ClientEmitter.prototype.emit = function(channel, evt) {
  this.pubnub.publish({
    channel: channel,
    message: evt
  });
}

module.exports = ClientEmitter;
