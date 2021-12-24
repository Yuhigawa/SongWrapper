// const spotify = require('./spotify/index')();

const express = require('express');
const server = express();
const axios = require('axios');

const spotify_routes = require('./spotify/index');
const deezer_routes = require('./deezer/index');
const youtube_routes = require('./youtube/index');

server.use(express.json());
server.use('/spotify', spotify_routes);
server.use('/deezer', deezer_routes);
server.use('/youtube', youtube_routes);

module.exports = server;