const express = require('express');
const router = express.Router();
const rates = [9600,19200,38400,57600,115200,230400];
const connection = require('../util/portconfig');

router.post('/:baudrate', (req,res) =>
{
    // if( validateInput(req.params['baudrate']))
    // {
    //     connection.port.close(() =>
    //     {
    //         console.log('closed')
    //         // const command = `<${req.params['baudrate']}\r`;
    //         connection.reOpenPort(req.params['baudrate']);
    //         console.log(connection.port.baudRate)


    //     });
        
    //     // connection.processInput(command);
    //     // connection.reOpenPort(req.params['baudrate']);
    //     // console.log(connection.port.baudRate)
    //     res.send('processed')
    // }
    // else
    // {
    //     res.status(400).send(req.params['baudrate'])
    // }
  
});

function validateInput(baudrate)
{
    found = false;
    rates.forEach((rate) =>
    {
        if(rate == baudrate)
        {
            found = true;
        }
    })
    return found;
}



module.exports = router;