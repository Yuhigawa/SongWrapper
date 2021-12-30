const axios = require('axios');
const querystring = require('querystring');

const express = require('express');
const routes = express.Router();

const DeezerWebAPi = require('./api/DeezerWebApi');
const { throws } = require('assert');

const app_perms = 'basic_access, email, offline_access, manage_library';

// const env = require('../../env.json');
// const deezerApi = new DeezerWebAPi(
//     app_id = env.deezerClientId,
//     app_secret = env.deezerClientSecret,
//     app_redirect = env.deezerRedirectUri
// );

require('dotenv').config();
const deezerApi = new DeezerWebAPi(
    app_id = process.env.deezerClientId,
    app_secret = process.env.deezerClientSecret,
    app_redirect = process.env.deezerRedirectUri
);
    
routes.get('/login', async (req, res) => {
    // res.redirect(`https://connect.deezer.com/oauth/auth.php?app_id=${app_id}&redirect_uri=${app_redirect}&perms=${app_perms}`);
    res.redirect(deezerApi.createAuthorizeURL(app_perms));
});

routes.get('/callback', async (req, res) => {
    const q_data = req.query;

    try {
        const error = req.query.error;

        if (error) {
            console.error('<DEEZER> Callback Error:', error);
            // return res.send({status: 500, message:`Callback Error: ${error}`});
            res.status(500).json({ message: `Callback Error`, status: 500 });
        }
    } catch (error) {
        console.log('<DEEZER> Query doesnt have error param');
    }


    deezerApi.authorizationCodeGrant(q_data.code)
        .then(async (response) => {
            const access_token = await response.data.access_token;
            const token_expiration = await response.data.expires;
            deezerApi.setAccessToken(access_token);

            const user_data = await deezerApi.userData(access_token);
            deezerApi.setUserData(user_data.data);

            const query = new URLSearchParams({
                "access_token": access_token,
                "message": 'Authorized successfully',
                "status": 200
            });
            // res.redirect('http://localhost:8000/?' + query);

            // res.redirect('http://localhost:8000/');

            res.status(200).json({ status: 200, message: 'Authorized successfully', response: access_token });

            if (token_expiration != 0) {
                setInterval(async () => {
                    console.log('<DEEZER> Access token need to be refreshed');
                }, token_expiration / 2 * 1000);
            }

        })
        .catch(error => {
            console.error('<DEEZER> Error getting Tokens:', error);
            res.status(500).json({ status: 500, message: 'Error getting Tokens' });
        });
});

routes.get('/create_playlist', async (req, res) => {
    const user_data = deezerApi.getUserData();

    try {
        const response = await deezerApi.createPlaylist(title = 'test playlist', user_id = user_data.id);
        res.status(200).json({ status: 200, message: 'Playlist created', response: response.data });
    } catch (error) {
        console.error('<DEEZER> Error getting Tokens:', error);
        res.status(500).json({ status: 500, message: 'Error creating playlist' });
    }
});

routes.get('/add_track', async (req, res) => {
    const query_params = req.query;
    let track_list = '';

    try {
        query_params.track_ids.forEach(element => {
            track_list += `${element},`;
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Something went wrong at getting track items' })
    }

    deezerApi
        .addTracksToPlaylist(playlist_id = query_params.playlist_id, track_list = track_list)
        .then(response => {
            if (response.data != true) {
                throw new Error(`${response.data.error.message}`);
            }

            res.status(response.status).json({ status: response.status, message: 'Track(s) added to playlist', response: response.data });
        })
        .catch(error => {
            console.error('<DEEZER> Error getting Tokens:', error);
            res.status(300).json({ status: 300, message: `${error}` });
        });
});

routes.get('/search', (req, res) => {
    const query_data = req.query;
    let query_song;
    let query_artist;

    try {
        query_song = query_data.song_name;
    } catch (error) {
        res.status(400).json({ status: 400, message: 'Track name not provided' });
        throw new Error('song not provid');
    }

    try {
        query_artist = query_data.artist_name;
    } catch (error) {
        res.status(400).json({ status: 400, message: 'Artist name not provided' });
        throw new Error('Artist not provid');
    }

    let query_string = `artist:'${query_artist}' track:'${query_song}'`;

    deezerApi
        .searchTracks(query_string)
        .then(async (response) => {
            // TODO: create a universal json response on search query.

            // let track_list = [];

            // try {
            //     response.data.data.forEach(element => {
            //         track_list.push(element.id);
            //     });
            // } catch (error) {
            //     res.status(500).json({ status: 500, message: 'Someting went wrong with the search items' });
            // }

            if ( response.data.data.length == 0 ) {
                console.log("<DEEZER> Error at search route: ", data.body);
                res.status(404).json({ status: 404, message: 'No item found' });
            } else {
                let message = `Search tracks by ${query_data.song_name} in the track name and ${query_data.artist_name} in the artist name`;
                res.status(200).json({ status: 200, message: message, response: response.data.data[response.data.data.length - 1].id });
            }
        }, function (err) {
            console.log('<DEEZER> Something went wrong!', err);
            res.status(500).json({ status: 500, message: 'Something went wrong at search route' });
        });
});

module.exports = routes;