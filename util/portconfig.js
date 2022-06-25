const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

//Serial Ports 
const port = new SerialPort({
    path: 'COM7',
    baudRate: 9600,
    // parser: new ReadlineParser('\n')
  });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
// //Callbacks
// const queue = [];
// parser.on('data', readSerialData);

const queue = [];

function processInput(controlOrder)
{
    connection.port.write(controlOrder);
}

module.exports = {port, parser, queue, processInput };