# Chatbot Hackpack Tutorial

### Overview
We're going to build a chatbot with Node.js that integrates with Facebook Messenger.

### What is a chatbot?
A chatbot is an application that users can interact with via 'conversational UI'. In other words, instead of interacting with an app on your phone, you chat with an app. This new medium of interaction with 'apps' works very well for a lot of situations and doesn't make sense for others. You can check out some chatbots like [Poncho]() or []() for examples. You can just message these like you would message anyone on Messenger.

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

Restart your server after updating the token, and try messaging your bot again.

### Adding some real responses!
So right now your bot responds with the same message regardless of what message is sent to you. We're going to add some commands so your bot actually does *something*.

### Letting people test your bot.
Right now, if anyone tries to message your bot, they won't get a response. This is because Facebook only allows bots to be public after a submission process (highly encourage you to build something and submit it!).

### Moving forward
Your bot can actually do something now!

But the possibilities are limitless. Here are a few.

1. Add a database to your app (like [MongoDB]() or [PostgreSQL]()) so you can link the user key from messages to a certain user.
2. Integrate with [Wit.ai](wit.ai). Wit gives you the power of their AI/NLP algorithms that can easily parse through text input (from your users) and extract useful information from those inputs.
3. Just add more commands for your app! Many very useful chatbots rely on pure command input/output.
