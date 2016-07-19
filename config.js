require('dotenv').config();

var config = {
  base: process.env['BASE_URL'],
  nexmoApiKey: process.env['NEXMO_API_KEY'],
  nexmoApiSecret: process.env['NEXMO_API_SECRET'],
  applicationId: process.env['APP_UUID'],
  keyFile: process.env['KEY_FILE'],
  pubNubPubKey: process.env['PUBNUB_PUB_KEY'],
  pubNubSubKey: process.env['PUBSUB_SUB_KEY'],
  inboundNumber: process.env['INBOUND_NUMBER'],
  inboundNumberCountryCode: process.env['INBOUND_NUMBER_COUNTRY_CODE'],
  proxyToNumber: process.env['PROXY_TO_NUMBER'],
  port: process.env['PORT'] || 5000
};

module.exports = config;
