const fs = require('fs');
const axios = require('axios');
const { stringify } = require('querystring');

var client_id = 'c17e9b2068874c459fe9e2b12982b985';
var client_secret = '9ba489dfea444d2c9bfcd1073fdfbd68';

var authOptions = {
  method: 'post',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${client_id}:${client_secret}`,
  },
  body: {
    'grant_type': 'client_credentials'
  },
};

module.exports = function AuthToken() {
    axios(authOptions).then(function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = body.access_token;
        try {
          fs.writeFileSync('./src/spotify/secrets.js', JSON.stringify(token))
        }catch(error) {
          console.error('Erro: ')
        }
      }
      else {
          console.error('NAO DEU')
      }
    });
}
