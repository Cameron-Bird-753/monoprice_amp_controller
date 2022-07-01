const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
let userDefinedBaud = null;
const defaultPath = "/dev/ttyUSB0";

//Serial Ports 
let port = new SerialPort({
    path:  defaultPath || "/dev/ttyUSB0",
    baudRate: 9600 || userDefinedBaud,
  
  });

//LIST SERIAL PORTS
SerialPort.list().then(
  ports => ports.forEach(port =>console.log(port.path)),
  err => console.log('no ports',err));

//PARSER
let parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

function processInput(controlOrder)
{
    port.write(controlOrder);
}


module.exports = {port, parser, processInput };