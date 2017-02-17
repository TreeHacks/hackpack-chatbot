# Chatbot Hackpack Tutorial

### Overview
We're going to build a chatbot with Node.js that integrates with Facebook Messenger.

### What is a chatbot?
A chatbot is an application that users can interact with via 'conversational UI'. In other words, instead of interacting with an app on your phone, you chat with an app. This new medium of interaction with 'apps' works very well for a lot of situations and doesn't make sense for others. You can check out some chatbots like [Poncho]() or []() for examples. You can just message these like you would message anyone on Messenger.

### Prerequisites
- Node.js (https://nodejs.org/en/)
- Ngrok (https://ngrok.com/)
- A Facebook Account (and Facebook Developer Account)

### Getting started
Either add ngrok to your current directory or add it to your PATH ([this](http://stackoverflow.com/questions/30188582/ngrok-command-not-found) is a bit on how to do that) so that you can call it whenever you need to.

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

![Add new](https://cloud.githubusercontent.com/assets/3401801/20452060/9ce089e8-adb6-11e6-8885-efe3f7af915b.png "add new")

Once it's created, you'll get to a page like this:

![Dev page](https://cloud.githubusercontent.com/assets/3401801/20474730/f03d4e56-af7c-11e6-9b36-fc446c0c770a.png "dev page")

To interact with your chatbot, you'll need to have a Facebook Page that's subscribed to the chatbot. Under 'Token Generation' either add an existing page or 'Create a new page' to add one. You'll need a Facebook Page so you can message your bot!

![Token generation](https://cloud.githubusercontent.com/assets/3401801/20451879/b016f522-adb3-11e6-815e-fcaf4646fbb8.png "token generation")

Then, you'll see an access token. Replace the top of `config.js` like so:

```
var messengerPageToken = process.env.MESSENGER_TOKEN || 'YOUR_ACCESS_TOKEN';
```

Cool! Now Messenger knows your app exists, kind of!

### Testing it out
Before building out the real functionality of your app, we've included a 'hello world' of sorts so you can test if you set up your Messenger app correctly.

Steps:

1. Install ngrok if you haven't already.
2. Run your hackpack-chatbot app
- - Make sure you're in the top-level directory of the app
  - Run `node index.js` (should print out server port)
3. Run `ngrok http 3000` in a separate terminal (replace 3000 with whatever port you decide to use -- default is 3000)
4. Copy the https ngrok url (the one that begins with 'https://') (your url will be different from the one in the picture)

![ngrok](https://cloud.githubusercontent.com/assets/3401801/20452058/98e2c63a-adb6-11e6-96d0-30cc76695425.png "ngrok")

Then, back in the Messenger dashboard, go to your app and click 'Add Product'. Find and choose 'Webhooks'.

Back in the Messenger tab on the left side-bar, scroll to 'Webhooks'. Click on 'Setup Webhooks'.

![setup webhooks](https://cloud.githubusercontent.com/assets/3401801/20451882/b39f753e-adb3-11e6-99e3-223afd253044.png)

and paste the ngrok url into the "Callback URL" field.

In 'Verify Token', type 'TOKEN'. Usually, this should be a unique, secret key so Facebook can confirm it's *your* app that it's sending messages to. 'TOKEN' is hard-coded into the code, but usually you want something that would be unique to your app.

Check `messages` and `messaging_postbacks` in the "Subscription Fields" section. These are the message types that your app will respond to. Later, depending on what your bot ends up doing, you may need to add subscription fields.

![webhook config](https://cloud.githubusercontent.com/assets/3401801/20451884/bc72140a-adb3-11e6-8a9e-bdc4081bbb72.png "webhook config")

If you end up having to restart ngrok (i. e. if you have to restart your computer), you can go to the 'Webhooks' tab on the left side-bar and update the webhook.

Click 'Add a Button' on your Facebook Page. Then, go to 'Get in Touch' > 'Send Message' > 'Add Button'. Hover over the button and hit 'Test Button' and try sending your bot a message. You may have to change your view Your bot should respond "Hello world!" Or not...

If you get no responses and see no requests in your ngrok logs (nothing new shows up in the terminal that's running ngrok), you may need to do the following:

1. Restart your node server
  - `ctrl-c` in the terminal that your node server is running
  - `node index.js`
2. To subscribe your app manually, you can enter the following command into a terminal:
```
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=YOUR_ACCESS_TOKEN"
```

Where `YOUR_ACCESS_TOKEN` is the token you got from the Messenger dashboard. You should get a json object that has something like `success: true`.

### Adding some real responses!
So right now your bot responds with the same message regardless of what message is sent to you. We're going to add some commands so your bot actually does *something*.

Wikipedia has an [API](https://www.mediawiki.org/wiki/API:Main_page) that allows you to do a number of things with their articles (edit, query, view, etc.). We're going to make your bot respond with random Wiki articles.

In `src/bot/wiki.js`, add the following:

```
import request from 'request-promise';
import _ from 'lodash';

export const getRandomWikiArticleLink = () => {
  return request({
    uri: 'https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json',
    qs: {
      action: 'query',
      list: 'random',
      rnlimit: 1,
      format: 'json'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }).then(data => {
    if(_.has(data, 'query.random.0')) {
      return createLinkFromWikiId(data.query.random[0].id);
    } else {
      throw new Error('failed to parse id from wiki response');
    }
  })
};

const createLinkFromWikiId = (id) => {
  return 'http://en.wikipedia.org/?curid=' + id;
};
```

This queries the API for a single random article and returns it back.

In `src/bot/index.js`, there's a function at the bottom called `getResponsesForMessage`. This'll be the command center for responding to individual messages. For now, change the function to look like this:

```
const getResponsesForMessage = ({message, userKey}) => {
  return new Promise((resolve, reject) => {
    if(message.text === 'hi') {
      resolve([responses.greetingMessage, responses.instructions]);
    } else if(message.text === 'random') {
      wiki.getRandomWikiArticleLink()
        .then(link => {
          resolve([responses.hereYouGo, link]);
        }).catch(() => {
          resolve([responses.failure])
        })
    } else {
      resolve([responses.invalidMessage]);
    }
  });
};
```

Now, whenever you message your bot 'hi', it'll respond with a greeting and instructions (check the top of the file for the contents of these messages). If you message 'random' to your bot, it'll get a random wiki article and send it to you.

If you haven't seen some of this syntax before, each line that says `resolve([SOMETHING])` is returning those messages to be sent back to the user.

### Adding more responses to your bot
Go to `src/bot/responses.js` and change `BOT NAME` to whatever you want your bot name to be.

Back in `src/bot/index.js`, in `getResponsesForMessage` that you just added to a minute ago, add in the extra case below:

```
const getResponsesForMessage = ({message, userKey}) => {
  return new Promise((resolve, reject) => {
    if(message.text === 'hi') {
      resolve([responses.greetingMessage, responses.instructions]);
    } else if(message.text === 'random') {
      wiki.getRandomWikiArticleLink()
        .then(link => {
          resolve([responses.hereYouGo, link]);
        }).catch(() => {
          resolve([responses.failure])
        })
    } // ADD THIS STATEMENT
    else if(responses.hasOwnProperty(message.text)) {
      resolve([responses[message.text]]);
    } else {
      resolve([responses.invalidMessage]);
    }
  });
};
```

Once you restart your server with this new change, try messaging your bot "Hello".

Then, "What's your name?"

Then, "Are you a robot?"

If everything's going right, you should get some 'real' responses! You can edit `src/bot/responses.js` to add more messages to handle and respond to.

### Letting people test your bot.
Right now, if anyone other than you (or whoever registered the chatbot app on Facebook) tries to message your bot, they won't get a response. This is because Facebook only allows bots to be public after a submission process (highly encourage you to build something and submit it!).

In your app dashboard, go to 'Roles'. Add the people you want to have access to interact with the bot to 'Testers' (or 'Developers', if they're helping develop it).

### Moving forward
Your bot is functional now!

Having `if` statements to handle different commands is fine for some bots, but as you build something more and more complicated, you'll likely want to come up with different ways to handle input.

The extension possibilities are limitless. Here are a few:

1. Add a database to your app (like [MongoDB]() or [PostgreSQL]()) so you can link the user key from messages to a certain user.
2. Integrate with [Wit.ai](wit.ai). Wit gives you the power of their AI/NLP algorithms that can easily parse through text input (from your users) and extract useful information from those inputs.
3. Just add more commands for your app! Many very useful chatbots rely on pure command input/output.
