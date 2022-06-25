const express = require('express');
const router = express.Router();
const rates = [9600,19200,38400,57600,115200,230400];
const connection = require('../util/portconfig');

router.post('/:baudrate', (req,res) =>
{
    let answer = validateInput(req.params['baudrate']);
    console.log(answer);
    if(answer)
    {
        let newKeypadName = req.body.padStart(8);
        const controlOrder = `${req.params['keypad']}<${newKeypadName}\r`;
        // connection.processInput(controlOrder);
        res.status(200).send(req.params['baudrate'])
    }
    else
    {
        res.status(400).send(req.params['baudrate'])
    }
  
});

function validateInput(baudrate)
{
    found = false;
    rates.forEach((rate) =>
    {
        console.log(rate);
        if(rate == baudrate)
        {
            found = true;
        }
    })
    return found;
}

module.exports = router;