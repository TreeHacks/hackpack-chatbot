/*
 * This is the actual logic behind the messages
 */
import _ from 'lodash';

const responses = {
  instructions: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: "Press a button!",
      buttons: [
        {
          type: 'postback',
          title: 'Button 1',
          payload: 'button 1'
        },
        {
          type: 'postback',
          title: 'Button 2',
          payload: 'button 2'
        },
        {
          type: 'postback',
          title: 'Button 3',
          payload: 'Button 3'
        }
      ]
    }
  },
  greetingMessage: "Hello world!",
  invalidMessage: "Sorry, didn't understand that!",
  locationInstruction: {
    text: 'Please share your location.',
    quick_replies: [
      {
        "content_type":"location",
      }
    ]
  }
}

// commands should only work while not in 
const commands = ['$location'];

export const handleMessage = ({message, userKey}) => {
  return getResponsesForMessage({message, userKey})
  .then(messages => {
    return generateMessagesFromArray(messages, userKey);
  })
};

const generateMessagesFromArray = (messages, key) => {
  let msgs = [];

  messages.forEach(message => {
    msgs = msgs.concat(buildMessage(message, key));
  });
  console.log(msgs);

  return msgs;
};

const buildMessage = (message, key) => {
  if(typeof message === 'string') {
    return {
      text: message,
      key
    }
  } else if(typeof message === 'object') {
    return {
      attachment: message,
      key
    }
  }
}

// you have message and user (user's id)
const getResponsesForMessage = ({message, userKey}) => {
  return new Promise((resolve, reject) => {
    resolve([responses.greetingMessage, responses.instructions]);
  });
};
