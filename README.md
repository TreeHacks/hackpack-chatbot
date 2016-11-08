# Chatbot Hackpack Tutorial

### Overview
We're going to build a chatbot with Node.js that integrates with Facebook Messenger.

### Prerequisites
- Node.js (https://nodejs.org/en/)
- Ngrok (https://ngrok.com/)

### Getting started
First, you'll want to clone this repository locally and `cd` into it:

```
git clone https://github.com/treehacks/hackpack-chatbot
cd hackpack-chatbot
```

Then install the dependencies:

```
npm install
```

### Interacting with Facebook Messenger
For your bot to work with Messenger, you'll have configure some things on their platform first.

Go to https://developers.facebook.com/apps/ and create an app (under category, put 'Messenger Bot'):

Once it's created, you'll get to a page like this:

To interact with your chatbot, you'll need to have a Facebook Page that's subscribed to the chatbot. Under 'Token Generation' either add your page or create a new page to add.

Then, you'll see an access token. Copy this into `config.js` like so:

Cool! Now Messenger knows your app exists, kind of!

### Testing it out
Before building out the real functionality of your app, we've included a 'hello world' of sorts so you can test if you set up your Messenger app correctly.

Steps:

1. Install ngrok if you haven't already.
2. Run your hackpack-chatbot app
- - Make sure you're in the top-level directory of the app
  - Run `node index.js` (should print out server port)
3. Run `ngrok http 3000` in a separate terminal (replace 3000 with whatever port you decide to use -- default is 3000)
4. Copy the ngrok url (highlighted in picture)

Then, back in the Messenger dashboard, go to your app and click 'Add Product'. Find and choose 'Webhooks'.

Back in the Messenger tab on the left side-bar, scroll to 'Webhooks' and paste the following in the "Callback URL" field: [ngrok url]/messenger/webhook

In 'Verify Token', type 'TOKEN'.

Check `messages` and `messaging_postbacks` in the "Subscription Fields" section.

Try sending your bot a message (message the page that you subscribed the messenger app to). If you get no responses and see no requests in your ngrok logs, you may need to do the following:

1. Restart your node server
  - `ctrl-c` in the terminal that your node server is running
  - `node index.js`
2. To subscribe your app manually, you can enter the following command into a terminal:
```
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=YOUR_ACCESS_TOKEN"
```
Where `YOUR_ACCESS_TOKEN` is the token you got from the Messenger dashboard.
