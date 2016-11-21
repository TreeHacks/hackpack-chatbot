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
