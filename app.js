// Import express application
const express = require('express');
const bodyParser = require('body-parser');



const app = express(); //execute express and assign to variable
app.use(bodyParser.text());





// SerialPort.list().then(
//     ports => ports.forEach(port =>console.log(port.path)),
//     err => console.log('no ports',err));

// DEFAULT ROUTES
app.get('/', (req,res) =>
{
    res.send('On Home Page');
});

//IMPORTED ROUTES

const zoneRoutes = require('./routes/zones');
const keypadRoutes = require('./routes/keypad');
const baudRoutes = require('./routes/baud');
const sourceRoutes = require('./routes/source');
// app.use(['/zones','/zones/:id','/zones/:id/:control-action'],zoneRoutes);
app.use('/zones',zoneRoutes);
app.use('/keypad',keypadRoutes);
app.use('/baud',baudRoutes);
app.use('/source',sourceRoutes);

// Port Number
app.listen(3000);


