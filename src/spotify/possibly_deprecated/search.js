const axios = require('axios');

const secret = require('./assets/secrets.json');

module.exports = async function search() {
    try {
     const response = await axios({
                        method: 'get',
                        url: `https://api.spotify.com/v1/search?q=billie%20eilish&type=artist`,
                        headers:{
                                    'Content-Type' : 'application/json', 
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${secret}`,
                                },
                    })

        console.log(response);
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

    // https://api.spotify.com/v1/search?q=track:"
    // ' + despacito + '
    // "%20artist:"
    // ' + bieber + '
    // "&type=track
}