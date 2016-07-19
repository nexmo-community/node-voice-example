# Walkthrough Step to Build a Call Tracker with the Nexmo Voice API

## Walkthrough

### Prerequisites

You'll need a Nexmo account. Signup at <https://dashboard.nexmo.com/sign-up>.

Give the workshop your API KEY for some additional credit!

You will need the following installed:

* A Git client
* Node
* A local tunnel solutions such as [ngrok](https://ngrok.com/)
* Open up the documentation <https://docs-ea.nexmo.com/voice/voice-api> - if you're in a workshop then as the instructors for the username/password

Get this code:

```sh
git clone git@github.com:nexmo-community/nexmo-node-call-tracking.git
cd nexmo-node-call-tracking
git checkout getting-started
```

Install the Nexmo Command Line Interfaces (CLI):

```sh
npm install -g nexmo-cli
```

Setup the Nexmo CLI with credentials from [settings in the Nexmo Dashboard](https://dashboard.nexmo.com/settings):

```sh
nexmo s NEXMO_API_KEY NEXMO_API_SECRET
```

### Create an Application in Nexmo

From within the `nexmo-node-call-tracking` directory:

```sh
nexmo app:create call-tracking --keyfile key.txt http://example.com http://example.com
```

### Create a `.env` file with configuration information

There is an existing `example.env` that we can use.

```sh
cp example.env .env
```

Update the values as required.

### Buy some Numbers

First, find some numbers:

```sh
nexmo number:search US
```

The buy some numbers:

```sh
nexmo number:buy [NUMBER]
```

### Link the Numbers to Application

For each number that has been purchased, link them to your application.

```sh
nexmo link:app [LVN] [app-id]
```

### Update Webhook URLs

Update the app to set the webhook urls to be your server instead of the example.com placeholders used at creation.

```sh
nexmo app:update ['app-id'] demo-app [your url]/answer [your url]/event
```

### Add a simple outbound call on the `/call/:number` route

* Implement the `/call/:number` route
* Implement the outbound request within `CallTracker.prototype.call` sending the following body payload

```js
{
  "to": [{
    "type": "phone",
    "number": "TO_NUMBER"
  }],
  "from": {
    "type": "phone",
    "number": "FROM_NUMBER"
  },
  "answer_url": ["ANSWER_WEBHOOK_URL"],
  "event_url": ["EVENT_WEBHOOK_URL"]
}
```

### Implement `/talk` Webhook endpoint to return NCCO

https://docs-ea.nexmo.com/voice/voice-api/ncco-reference#talk

### Implement `/answer` Route with Proxy NCCO

```json
[
  {
    "action": "connect",
    "from": "FROM_NUMBER",
    "endpoint": [
        {
            "type": "phone",
            "number": "PROXY_TO_NUMBER"
        }
    ]
  }
]
```

### Implement Recording by Updating the NCCO

```json
[
    {
        "action": "record",
        "eventUrl": [
            "https://voice.ngrok.io/recording?from={RECORDING_FROM}&to={RECORDING_TO}"
        ]
    },
    ...
]
```

### Implement the `/recording` route to be notified when the recording is complete

Build a download URL that contains the API & Secret and try using it to listen to the recording.

### Implement the `/play/:id` route

But we wouldn't want to expose the API and Secret in a real app. So, let's create an endpoint that fetches the MP3 and serves it.

### Update the `/recording` route to send an SMS to the call originator

Now that we have a `/play/:id` endpoint let's send an SMS all the call originator so that they can listen to the call they made.

## Troubleshooting

### asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag

If you're seeing errors such as `asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag` then you should run the following on your `key.txt`:

```sh
openssl rsa -in key.txt -out key.txt
```

### Illegal Sender Address - rejected

Ensure that when sending an SMS that you are sending `from` a LVN registered with Nexmo.
