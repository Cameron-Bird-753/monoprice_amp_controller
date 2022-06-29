const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
let userDefinedBaud = null;
//Serial Ports 
let port = new SerialPort({
    path: 'COM3',
    baudRate: 9600 || userDefinedBaud,
    // parser: new ReadlineParser('\n')
  });
let parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

function processInput(controlOrder)
{
    port.write(controlOrder);
}


module.exports = {port, parser, processInput };