const express = require('express');
const router = express.Router();
const connection = require('../util/portconfig');
router.post('/:keypad', (req,res) =>
{
    var ascii = /^[ -~]+$/;
    const validInput = ascii.test( req.body ) && (req.body.length > 0 && req.body.length <=8);
    if(validInput)
    {
        let newKeypadName = req.body.padStart(8);
        const controlOrder = `${req.params['keypad']}<${newKeypadName}\r`;
        connection.processInput(controlOrder);
        res.send(req.body);
    }
    else
    {
        res.send('invalid',400)
    }
  
});

module.exports = router;