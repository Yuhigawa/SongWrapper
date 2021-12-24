const axios = require('axios');
const fs = require('fs');

const secret = require('./assets/secrets.json');

module.exports = async function playlist() {
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/users/yuhigawa/playlists`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${secret.access_token}`,
            },
            data: {
                'name': 'Playlist test',
                'description': 'descript test',
                'public': true,
            },
        });

        try {
            fs.writeFileSync('./src/spotify/assets/spotify_playlist_data.json', JSON.stringify(response.data));
        } catch (error) {
            console.error('Erro writing file')
        }
        return 200;
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