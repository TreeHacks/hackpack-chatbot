import request from 'request-promise';
import * as _ from 'lodash';
import config from '../config';
import * as bot from '../bot/index';

// For webhook verification with messenger's platform
export let verifyMessenger = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.messengerVerifyToken) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
};

// On receipt of messages, handle each one
export let handleMessages = (req, res) => {
  let entries = req.body.entry;

  if(typeof entries !== 'object' || entries.length < 1) {
    logger.error('Unable to parse \'entry\' of messenger webhook');
    res.sendStatus(500);
    return;
  }

  req.body.entry.forEach((event, index) => {
    if(!_.hasIn(event, 'messaging.0')) {
      return;
    }

    event.messaging.forEach(handleMessageEvent);
  });

  res.sendStatus(200);
};

// Handle an individual message event
let handleMessageEvent = (event) => {
  let sender = event.sender.id.toString();
  let message = parseMessageObj(event);

  return bot.handleMessage({
    message,
    userKey: sender
  }).then(responses => {
    console.log('Responding: ')
    console.log(responses);
    if(_.has(responses, '0')) {
      responses.forEach(response => {
        if(response.text) {
          return sendMessage({
            text: response.text
          }, response.key)
        } else if(response.attachment) {
          return sendMessage({
            attachment: response.attachment
          }, response.key);
        } else if(response.messageObj) {
          return sendMessage(
            response.messageObj,
            response.key
          )
        } else {
          return sendMessage({
            text: `Something's screwing up on our side... Post on our wall if you're having difficulty!`
          }, response.key)
        }
      });
    }
  });
};

// Parses messenger formatted messages
// Returns message object that can contain:
//   text
//   latitude
//   longitude
const parseMessageObj = (event) => {
  let msg = {};

  const message = event.message;
  const postback = event.postback;

  if(_.has(message, 'is_echo')) {
    return false;
  }

  if(_.hasIn(message, 'attachments.0.payload.coordinates')) {
    msg.latitude = message.attachments[0].payload.coordinates.lat
    msg.longitude = message.attachments[0].payload.coordinates.long
  }

  if(_.has(message, 'text')) {
    msg.text = message.text
  }

  if(postback) {
    if(postback.payload) {
      msg.text = postback.payload;
    }
  }

  if(!msg.text && (!msg.latitude && !msg.longitude)) {
    return false;
  }

  return msg;
};

// Sends message to senderId's messenger
let sendMessage = (messageData, senderId) => {
  if(messageData) {
    return new Promise((resolve, reject) => {
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: config.messengerPageToken
        },
        method: 'POST',
        json: {
          recipient: {
            id: senderId
          },
          message: messageData
        }
      })
      .then(result => {
        resolve();
      });
    });
  } else {
    return Promise.resolve();
  }
};
