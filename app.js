// Import express application
const express = require('express');
const bodyParser = require('body-parser');
//HEADER OPTIONS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


const app = express(); //execute express and assign to variable
app.use(allowCrossDomain);
app.use(bodyParser.text());
app.use(bodyParser.json());



// DEFAULT ROUTES
app.get('/', (req,res) =>
{
    res.send('On Home Page');
});

//IMPORTED ROUTES

const zoneRoutes = require('./routes/zones');
const keypadRoutes = require('./routes/keypad');
const baudRoutes = require('./routes/baud');
const sourceChannelRoutes = require('./routes/sourceChannels');
app.use('/zones',zoneRoutes);
app.use('/keypad',keypadRoutes);
app.use('/baud',baudRoutes);
app.use('/channels',sourceChannelRoutes);

// Port Number
app.listen(3001);


