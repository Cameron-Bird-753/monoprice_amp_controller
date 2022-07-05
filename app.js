// Imports & Constants
const express = require('express');
const bodyParser = require('body-parser');
const https =require('https') ;
const path =require('path');
const fs =require('fs');
require('dotenv').config();
const SERVER_PORT = process.env.SERVER_PORT || 443;
const app = express();
app.use(allowCrossDomain);
app.use(bodyParser.text());
app.use(bodyParser.json());

//HEADER OPTIONS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


// DEFAULT ROUTES
app.get('/', (req,res) =>
{
    res.status(200).send('Server Home Page');
});

//IMPORTED ROUTES

const zoneRoutes = require('./routes/zones');
const sourceChannelRoutes = require('./routes/sourceChannels');
app.use('/zones',zoneRoutes);
app.use('/channels',sourceChannelRoutes);

//ESTABLISH SERVER

const sslServer = https
  .createServer(
    {
      key: process.env.KEY,
      cert: process.env.CERT,
      ca: process.env.CA,
    },
    app
  )
  .listen(process.env.SERVER_PORT, () => {
    console.log(
      'SERVER IS RUNNING'
    );
  });