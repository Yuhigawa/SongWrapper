const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const routes = express.Router();

const axios = require('axios');
const env = require('../../env.json');

const spotifyApi = new SpotifyWebApi({
    redirectUri: env.spotifyRedirectUri,
    clientId: env.spotifyClientId,
    clientSecret: env.spotifyClientSecret
});

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

routes.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

routes.get('/callback', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    try {
        const error = req.query.error;

        if (error) {
            console.error('<SPOTIFY> Callback Error:', error);
            // return res.send({status: 500, message:`Callback Error: ${error}`});
            res.status(500).json({ message: `Callback Error: ${error}`, status: 500 })
        }
    } catch (error) {
        console.log('<SPOTIFY> Query doesnt have error param');
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);
            console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);

            // return res.send({status: 200, message: 'Authorized successfully', response: access_token});
            res.status(200).json({ status: 200, message: 'Authorized successfully', response: access_token });

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('<SPOTIFY> The access token has been refreshed!');
                console.log('<SPOTIFY> access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('<SPOTIFY> Error getting Tokens:', error);
            res.status(500).json({ status: 500, message: 'Error getting Tokens' });
        });
});

routes.get('/create_playlist', (req, res) => {
    const query_params = req.query;

    spotifyApi
        .createPlaylist(query_params.title, { 'description': query_params.description, 'public': true })
        .then(data => {
            // console.log('Created playlist!: ', data);
            var body_id = encodeURIComponent(data.body.id);
            // res.redirect('/add_track?playlist_id=' + body_id);
            // return res.send({status: 201, response: body_id});
            res.status(201).json({ status: 201, response: body_id });
        })
        .catch(err => {            
            console.log('<SPOTIFY> Something went wrong!', err);
            // return res.send({status: 500, message:'Something went wrong on creating the playlist'});
            res.status(500).json({ status: 500, message: 'Something went wrong on creating the playlist' });
        });
})

routes.get('/add_track', (req, res) => {
    const query_params = req.query;
    const track_list = [];

    try {
        query_params.track_ids.forEach(element => {
            track_list.push(`spotify:track:${element}`);
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Something went wrong at getting track items' })
    }

    spotifyApi
        .addTracksToPlaylist(query_params.playlist_id, track_list)
        .then((data) => {
            res.status(200).json({ status: 200, message: 'Added tracks to playlist!', response: data });
        })
        .catch((err) => {
            console.log('<SPOTIFY> Something went wrong!', err);
            res.status(500).json({ status: 500, message: 'Something went wrong at adding tracks to playlist' });
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
    
    let query_string = `track:${query_song} artist:${query_artist}`;

    spotifyApi
        .searchTracks(query_string)
        .then(async function (data) {
            // TODO: create a universal json response on search query.

            // let track_list = [];

            // try {
            //     data.body.tracks.items.forEach(element => {
            //         track_list.push(element.id);
            //     });
            // } catch (error) {
            //     res.status(500).json({ status: 500, message: 'Someting went wrong with the search items' });
            // }

            if (data.body.tracks.items.length == 0) {
                console.log("<SPOTIFY> Error at search route: ", data.body);
                res.status(404).json({ status: 404, message: 'No item found' });
            } else {
                let message = `Search tracks by ${query_data.song_name} in the track name and ${query_data.artist_name} in the artist name`;
                res.status(200).json({ status: 200, message: message, response: data.body.tracks.items[0].id });
            }
        }, function (err) {
            console.log('<SPOTIFY> Something went wrong!', err);
            res.status(500).json({ status: 500, message: 'Something went wrong at search route' });
        });
})

module.exports = routes; 