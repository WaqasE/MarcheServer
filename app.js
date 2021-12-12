'use strict';
// imports
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const http = require('http');
const server = http.createServer(app);
let io = require('socket.io')(server);

// Configs
dotenv.config();


// custom imports
const { port } = require('./app/config');
const { error, whitelist, route } = require('./app/middlewares');
const redirection = require('./app/routes/redirection');

// Middlewares
app.use(express.json());
// app.use(whitelist);
app.use(route);
app.use((req, res, next) => {
    req.io = io;
    next();
})
app.use('/api/v1', redirection);
app.use(error);



server.listen(port, () => console.log(`App is up and runing at ${port}`))