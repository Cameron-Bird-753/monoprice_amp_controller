const express = require('express');
const router = express.Router();
const connection = require('../util/portconfig');


router.post('/:sourchId', (req,res) =>
{
    const validInput = validateSourceCommand(req.params['sourchId'], req.body);
    if(validInput)
    {
        let newSourceName = req.body.padStart(8);
        const controlOrder = `${req.params['sourchId']}<${newSourceName}\r`;
        // connection.processInput(controlOrder);
        console.log(newSourceName.length);
        res.status(200).send(newSourceName);
    }
    else
    {
        res.send('invalid')
    }
});


function validateSourceCommand(sourceId, sourceName)
{
    var ascii = /^[ -~]+$/;
    if(!(sourceId >= 1 && sourceId <= 6)) //validate amp, zone & input as int. 
    {
        return false;
    }
    if(sourceName.length > 8 || !ascii.test( sourceName ))
    {
        return false;
    }
    return true;
}

module.exports = router;