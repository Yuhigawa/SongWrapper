const axios = require('axios');

module.exports = function search(secret) {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/search?q="remaster%20track:Doxy+artist:Miles%20Davis"`,
        headers:{
                    'Content-Type' : 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${secret.access_token}`,
                },
    })
    .then(function (response) {
        console.log(response.data)
        // fs.writeFileSync('./src/spotify/spotify_playlist_data.json', JSON.stringify(response.data));
    })
    // https://api.spotify.com/v1/search?q=track:"
    // ' + despacito + '
    // "%20artist:"
    // ' + bieber + '
    // "&type=track
}