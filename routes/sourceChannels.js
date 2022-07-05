const express = require('express');
const router = express.Router();
const connection = require('../util/portconfig');
var db = require("../data/doa")


router.post('/', async (req,res) =>
{
    try
    {
        let channel = 
        {
            id: req.body.id,
            name: req.body.name,
            active : req.body.active
        }
    
        const result = await db.updateChannel(channel);
       
        const updatedChannel = await db.getChannel(channel.id);
        console.log(updatedChannel);
        res.status(200).json(updatedChannel)
    }catch(err)
    {
        res.status(400).send('Error occured')
    }
});

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