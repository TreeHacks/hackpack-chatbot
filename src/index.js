import express from 'express';
import * as messenger from './messenger/index';
import bodyParser from 'body-parser';

let app = express();

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', messenger.verifyMessenger);
app.post('/', messenger.handleMessages);

app.listen(app.get('port'), () => {
  console.log('Server listening at port', app.get('port'));
});

