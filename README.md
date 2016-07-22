# Calling Tracking Demo using Node and the Nexmo Voice API

This app used the Voice API to demonstrate a few features.

* Incoming calls are proxied to a destination number
* The call is recorded
* A Link to the recording is sent to the destination number after the call

* All Call Events are published using PubNub to the main web page. Currently the events are just logged to the console. Please extend this view as you wish.

## Prerequisites

You will need:

* A Nexmo LVN (Phone Number)
* A New application
* Somewhere to host this web app, Heroku or Your Local Machine with ngrok both work well

## Installation

```sh
git clone https://github.com/nexmo-community/nexmo-node-call-tracking.git
cd nexmo-node-call-tracking
npm install
```

## Setup

Create the nexmo application, using the [Nexmo CLI](https://github.com/nexmo/nexmo-cli):

```sh
nexmo app:create demo-app --keyfile key.txt http://example.com http://example.com
```

Check that the private key has been saved to key.txt e.g. `cat key.txt`.

Rename the config file:

```sh
mv example.env .env
```

Fill in the values in `.env` as appropriate.

Link the LVN to the app id with the Nexmo CLI:

```sh
nexmo link:app [LVN] [app-id]
```

Update the app to set the webhook urls to be your server instead of the example.com placeholders used at creation.

```sh
nexmo app:update ['app-id'] demo-app [your url]/call [your url]/event
```

We recommend using [ngrok](https://ngrok.com/) to tunnel through to your locally running application. In which case the command above is likely to be something similar to:

```sh
nexmo app:update ['app-id'] demo-app https://___.ngrok.io/call https://___.ngrok.io/event
```

Where `___` should be replaced with the `ngrok.io` subdomain you are assigned.

### Running the App

```sh
npm start
```

The application should be available on <http://localhost:5000>.

### Using the App

Navigate to <http://localhost:5000>, and open up the JavaScript console.

Now, call the number that's listed on the page. From there you'll see events being logged to the JavaScript console as they come in to your application.

When the call is finished a text message will be sent to the number that all calls are being proxied to with a URL for the call recording. The URL for the call recording will also be pushed to the web browser.

## Troubleshooting

### asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag

If you're seeing errors such as `asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag` then you should run the following on your `key.txt`:

```sh
openssl rsa -in key.txt -out key.txt
```

### Illegal Sender Address - rejected

Ensure that when sending an SMS that you are sending `from` a LVN registered with Nexmo.
