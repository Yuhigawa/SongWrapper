const axios = require('axios');

const base_url = 'https://connect.deezer.com/oauth';
const base_url_user = 'https://api.deezer.com';

class DeezerWebApi {
    constructor(app_id, app_secret, app_redirect) {
        this.app_id = app_id;
        this.app_secret = app_secret;
        this.app_redirect = app_redirect;
        this.access_token = '';

        this.user_data = null;
    }

    createAuthorizeURL(perms) {
        return `${base_url}/auth.php?app_id=${this.app_id}&redirect_uri=${this.app_redirect}&perms=${perms}`;
    }

    async authorizationCodeGrant(code) {
        return await axios.get(`${base_url}/access_token.php?app_id=${this.app_id}&secret=${this.app_secret}&code=${code}&output=json&response_type=token`);
    }

    async refreshAccessToken() {
        return null;
    }

    setAccessToken(access_token) {
        this.access_token = access_token;
    }

    getAccessToken() {
        return this.access_token;
    }

    async createPlaylist(title, user_id) {
        return await axios.post(`${base_url_user}/user/${user_id}/playlists?title=${title}&access_token=${this.access_token}`);
    }

    // playlist/{playlist_id}/tracks
    async addTracksToPlaylist(playlist_id, track_list) {
        return await axios.post(`${base_url_user}/playlist/${playlist_id}/tracks?songs=${track_list}&access_token=${this.access_token}`);
    }

    async searchTracks(search_query) {
        return await axios.get(`${base_url_user}/search?q=${search_query}`);
    }

    async userData(access_token) {
        return await axios.get(`${base_url_user}/user/me?access_token=${access_token}`);
    }

    setUserData(data) {
        this.user_data = data;
    }

    getUserData() {
        return this.user_data;
    }
};

module.exports = DeezerWebApi;