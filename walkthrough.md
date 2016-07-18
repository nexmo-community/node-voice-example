# Walkthrough Step to Build a Call Tracker with the Nexmo Voice API

## Prerequisites

You'll need a Nexmo account. Signup at <https://dashboard.nexmo.com/sign-up>.

Give the workshop your API KEY for some additional credit!

You will need the following installed:

* A Git client
* Node
* A local tunnel solutions such as [ngrok](https://ngrok.com/)

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

## Create an Application in Nexmo

From within the `nexmo-node-call-tracking` directory:

```sh
nexmo app:create demo-app --keyfile key.txt http://example.com http://example.com
```

## Create a `.env` file with configuration information

There's an existing `example.env` that we can use.

```sh
cp example.env .env
```

Update the values as required.

## Buy some Numbers

First, find some numbers:

```sh
nexmo number:search US
```

The buy some numbers:

```sh
nexmo number:buy [NUMBER]
```

## Link the Numbers to Application

For each number that has been purchased, link them to your application.

```sh
nexmo link:app [LVN] [app-id]
```

## Update Webhook URLs

Update the app to set the webhook urls to be your server instead of the example.com placeholders used at creation.

```sh
nexmo app:update ['app-id'] demo-app [your url]/call [your url]/event
```

## Implement `/call` Route with Proxy NCCO

```json
[
  {
    "action": "connect",
    "from": "FROM_NUMBER",
    "endpoint": [
        {
            "type": "phone",
            "number": "PROXY_TO_NUMBEr"
        }
    ]
  }
]
```

## Implement Recording by Updating the NCCO

Note: we're overriding the `eventUrl` for this action.

```json
[
    {
        "action": "record",
        "beepStart": false,
        "eventUrl": [
            "https://voice.ngrok.io/recording?from={RECORDING_FROM}&to={RECORDING_TO}"
        ]
    },
    ...
}
```
