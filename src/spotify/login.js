const axios = require('axios');
const fs  = require('fs');

module.exports = function login(secret) {
    axios({
        method: 'post',
        url: `https://api.spotify.com/v1/users/yuhigawa/playlists`,
        headers:{
                    'Content-Type' : 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${secret.access_token}`,
                },
        data: {
            'name': 'Playlist Node Test3',
            'description': 'descript test3',
            'public': true,
        },
    })
    .then(function (response) {
        fs.writeFileSync('./src/spotify/spotify_playlist_data.json', JSON.stringify(response.data));
    })
    .then( () => {
        let rawdata = fs.readFileSync('./src/spotify/spotify_playlist_data.json');
        let punishments= JSON.parse(rawdata);
        console.log(punishments);
    });
}