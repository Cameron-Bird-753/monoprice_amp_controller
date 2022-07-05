const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
require('dotenv').config({path: '../.env'});
const SERIAL_PORT = 'COM7' || process.env.SERIAL_PORT;


//Serial Ports 
let port = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 })

//LIST SERIAL PORTS
// SerialPort.list().then(
//   ports => ports.forEach(port =>console.log(port)),
//   err => console.log('no ports',err));

//PARSER
let parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

function processInput(controlOrder)
{
    port.write(controlOrder);
}


module.exports = {port, parser, processInput };