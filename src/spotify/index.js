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
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        // return res.send({status: 500, message:`Callback Error: ${error}`});
        res.status(500).json({ message: `Callback Error: ${error}`, status: 500 })
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

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.status(500).json({ status: 500, message: 'Error getting Tokens' });
        });
});

routes.get('/create_playlist', (req, res) => {
    const query_params = req.query;

    spotifyApi
        .createPlaylist(query_params.title, { 'description': query_params.description, 'public': true })
        .then(data => {
            // console.log('Created playlist!: ', data);
            console.log('Created playlist!');

            var body_id = encodeURIComponent(data.body.id);
            // res.redirect('/add_track?playlist_id=' + body_id);
            // return res.send({status: 201, response: body_id});
            res.status(201).json({ status: 201, response: body_id });
        })
        .catch(err => {
            console.log('Something went wrong!', err);
            // return res.send({status: 500, message:'Something went wrong on creating the playlist'});
            res.status(500).json({ status: 500, message: 'Something went wrong on creating the playlist' });
        });
})

routes.get('/add_track', (req, res) => {
    const query_params = req.query;
    const track_list = [];

    try{
        query_params.track_ids.forEach(element => {
            track_list.push(`spotify:track:${element}`);
        });
    } catch(error) {
        // return res.send({status: 500, message: 'Something went wrong at getting track items'})
        res.status(500).json({status: 500, message: 'Something went wrong at getting track items'})
    }

    spotifyApi
        .addTracksToPlaylist(query_params.playlist_id, track_list)
        .then((data) => {
            // console.log('Added tracks to playlist!: ', data);
            // return res.send({status: 200, message: 'Added tracks to playlist!'});
            res.status(200).json({ status: 200, message: 'Added tracks to playlist!' });
        })
        .catch((err) => {
            console.log('Something went wrong!', err);
            // return res.send({status: 500, message: 'Something went wrong at adding tracks to playlist'});
            res.status(500).json({ status: 500, message: 'Something went wrong at adding tracks to playlist' });
        });
});

routes.get('/search', (req, res) => {
    const query_data = req.query;
    spotifyApi
        .searchTracks(`track:${query_data.song_name} artist:${query_data.artist_name}`)
        .then(async function (data) {
            let track_list = [];

            try {
                data.body.tracks.items.forEach(element => {
                    track_list.push(element.id);
                });
            } catch (error) {
                // return res.status({status: 500, message: 'Someting went wrong with the search items'});
                res.status(500).json({ status: 500, message: 'Someting went wrong with the search items' });
            }

            if (track_list.length == 0) {
                console.log("Error at search route: ", data.body);
                // return res.send({status: 404, message: 'Error at search the track'});
                res.status(404).json({ status: 404, message: 'No item found' });
            }else {
                let message = `Search tracks by ${query_data.song_name} in the track name and ${query_data.artist_name} in the artist name`;
                // return res.send({status: 200, message: message, response: track_list });
                res.status(200).json({ status: 200, message: message, response: track_list });
            }

            // var playlist_id = '3nIGImvnF8o9SONalBPFwo';
            // const param_send = {
            //     params: {
            //         track_ids: track_list,
            //         playlist_id: playlist_id,
            //     }
            // }

            // try {
            //     const get_res = await axios.get(`http://localhost:8000/add_track`, param_send);
            //     console.log(get_res);
            // } catch (error) {
            //     res.send('Add track route problem')

            //     return res.status(404);
            // }

        }, function (err) {
            console.log('Something went wrong!', err);
            // return res.send({status: 500, message: 'Something went wrong at search route'});
            res.status(500).json({ status: 500, message: 'Something went wrong at search route' });
        });
})

module.exports = routes; 