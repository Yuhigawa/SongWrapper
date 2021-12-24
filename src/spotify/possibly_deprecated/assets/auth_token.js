const fs = require('fs');
const axios = require('axios');

var client_id = 'c17e9b2068874c459fe9e2b12982b985';
var client_secret = '9ba489dfea444d2c9bfcd1073fdfbd68';

var encodedData = Buffer.from(client_id + ':' + client_secret).toString('base64');

var query_headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic ' + encodedData,
}

var query_body = {
  'grant_type': "client_credentials",
  
}

var authOptions = {
  method: 'post',
  url: 'https://accounts.spotify.com/api/token',
  headers: query_headers,
  boparamdy: query_body,
};

module.exports = async function AuthToken() {
  // const { data } = await axios.post(
  //   'https://accounts.spotify.com/api/token',
  //   'grant_type=client_credentials',
  //   headers=query_headers,
  // )
  
  // this.token = data.access_token

  // console.log("TOKEN:", this.token)

    axios(authOptions).then(function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = body.access_token;
        try {
          fs.writeFileSync('./src/spotify/assets/secrets.js', JSON.stringify(token))
        }catch(error) {
          console.error('Erro: ')
        }
      }
      else {
          console.error('NAO DEU')
      }
    });
}
