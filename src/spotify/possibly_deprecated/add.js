const axios = require('axios');

const secret = require('./assets/secrets.json');
const playlist_Id = require('./assets/spotify_playlist_data.json');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = async function add(song_tracks) {
    await sleep(5000);
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/playlists/${playlist_Id.id}/tracks`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${secret.access_token}`,
            },
            data: {
                'uris': [
                    `spotify:track:${song_tracks}`,
                ],
            },
        })

        return response.data;
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
}