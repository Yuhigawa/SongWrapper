const login = require('./login');
const search = require('./search');
const add = require('./add');
const token = require('./auth_token');

const secrets = require('./secrets.json')
const playlist_secret = require('./spotify_playlist_data.json')

module.exports = () => {
    token();

    // login(secrets);
    // add(secrets, playlist_secret.id,'4HOryCnbme0zBnF8LWij3f')
    
    // search(secrets);
};