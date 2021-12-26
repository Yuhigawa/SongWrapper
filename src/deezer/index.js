const axios = require('axios');

const express = require('express');
const routes = express.Router();

const env = require('../../env.json');

const _app_id = env.deezerClientId;
const _app_secret = env.deezerClientSecret;
const _app_redirect = env.deezerRedirectUri;
const app_perms = 'basic_access, email, offline_access, manage_library';

const DeezerWebAPi = require('./api/DeezerWebApi');

const deezerApi = new DeezerWebAPi(
    app_id = _app_id,
    app_secret = _app_secret,
    app_redirect = _app_redirect
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
            console.error('Callback Error:', error);
            // return res.send({status: 500, message:`Callback Error: ${error}`});
            res.status(500).json({ message: `Callback Error`, status: 500 });
        }
    } catch (error) {
        console.log('Query doesnt have error param');
    }


    deezerApi.authorizationCodeGrant(q_data.code)
        .then(async (response) => {
            const access_token = await response.data.access_token;
            const token_expiration = await response.data.expires;
            deezerApi.setAccessToken(access_token);
            
            const user_data = await deezerApi.userData(access_token);
            deezerApi.setUserData(user_data.data);

            res.status(200).json({ status: 200, message: 'Authorized successfully', response: access_token });

            if (token_expiration != 0) {
                setInterval(async () => {
                    // const data = await deezerApi.refreshAccessToken();
                    // const access_token = data.body['access_token'];

                    // console.log('The access token has been refreshed!');
                    // console.log('access_token:', access_token);
                    // deezerApi.setAccessToken(access_token);

                    console.log('Access token need to be refreshed');
                }, token_expiration / 2 * 1000);
            }

        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.status(500).json({ status: 500, message: 'Error getting Tokens' });
        });
});

routes.get('/create_playlist', async (req, res) => {
    const user_data = deezerApi.getUserData();

    try {
        const response = await deezerApi.createPlaylist(title='test playlist', user_id=user_data.id);
        res.status(200).json({ status: 200, message: 'Playlist created', response: response.data });
    } catch (error) {
        console.error('Error getting Tokens:', error);
            res.status(500).json({ status: 500, message: 'Error creating playlist' });
    }

});

module.exports = routes;