const axios = require('axios');

module.exports = function add(secret, playlist_Id, song_tracks) {
    axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/${playlist_Id}/tracks`,
        headers:{
                    'Content-Type' : 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${secret.access_token}`,
                },
        data: {
            'uris': [
                `spotify:track:${song_tracks}`,
            ],
        },
    })
    .then(function (response) {
        console.log(response.data)
        // fs.writeFileSync('./src/spotify/spotify_playlist_data.json', JSON.stringify(response.data));
    })
}