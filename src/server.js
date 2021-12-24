// const spotify = require('./spotify/index')();

const express = require('express');
const server = express();
const axios = require('axios');

const spotify_routes = require('./spotify/index');
const deezer_routes = require('./deezer/index');

server.use(express.json());
server.use('/spotify', spotify_routes);
server.use('/deezer', deezer_routes);

module.exports = server;