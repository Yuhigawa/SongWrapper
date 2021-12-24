var request = require('request'); // "Request" library
const fs  = require('fs');
const axios = require('axios');

const formUrlEncoded = x =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

module.exports = async function test_token() {
    var client_id = 'c17e9b2068874c459fe9e2b12982b985';
    var client_secret = '9ba489dfea444d2c9bfcd1073fdfbd68';

    // your application requests authorization
    var authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formUrlEncoded({
            grant_type: 'client_credentials'
        }),
    };

    try {
        const response = await axios(authOptions);
        var token = response.data;

        try {
            var jsonify_token = JSON.stringify(token)
        } catch(error) {
            console.error('jsonify')
            return "Error jsonify";
        }

        try {
            fs.writeFileSync('./src/spotify/assets/secrets.json', jsonify_token)
        }catch(error) {
            console.error('Erro: write file: ', error)
            return "Error writing file";
        }

        return token;
    } catch (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }

    //  await request.post(authOptions, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {

    //         // use the access token to access the Spotify Web API
    //         var token = body.access_token;

    //         try {
    //             var jsonify_token = JSON.stringify(token)
    //         } catch(error) {
    //             console.error('jsonify')
    //             return "Error jsonify";
    //         }

    //         console.log(jsonify_token)
    //         try {
    //             fs.writeFileSync('./src/spotify/assets/secrets.json', jsonify_token)
    //         }catch(error) {
    //             console.error('Erro: write file: ', error)
    //             return "Error writing file";
    //         }

    //         return token;
    //     } else {
    //         return '500';
    //     }
    // });
}