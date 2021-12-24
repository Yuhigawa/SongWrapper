const express = require('express');
const routes = express.Router();

routes.get('/login', (req, res) => {
    return res.status(200);
});

module.exports = routes;