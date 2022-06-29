/**
 * The zone.js is response for all api calls to query the current status, or to update the current status with a control action code.
 * The control action code has the following structure. Command control order Structure can be defined as 'xxPPuu' where:
 *       *xx -> The amp (1-3) and it respective zones (max 6 per amp). Ex. 11 is amp 1/zone 1, and 15 is amp 1/zone 5. 
 *          *NB 10/20/30 selects all zones for amp 1,2 or 3 respectively with global update.  
 *       PP -> control action code. PR (power), MU (mute), DT (do not disturb), VO (volume), TR (treble), BS(bass), BL(balance), CH (channel/source)
 *       uu ->  Each control action code has a numeric range that is accepted. Ex VO range 0...38 and BS 0...14
 */

const express = require('express');
const router = express.Router();
const monoprice = require('../models/Monoprice.js');
var db = require("../data/doa");
const connection = require('../util/portconfig');
connection.parser.on('data', readSerialData);
let receivedData = [];

function readSerialData(data)
{
  console.log('read serial data',data)
  if(data.length === 25)
  {
    console.log('pushing');
    receivedData.push(data);
  }
  return data;
} 


router.get('/', async (req,res) =>
 {
     try
     {
        const allZonesAmp1 = 10;
        const zoneQuery = `?${allZonesAmp1}\r`;
        connection.processInput(zoneQuery);
        const dbResults = await db.getAllZones();
        
        setTimeout(() => 
        {
            let arr = [];
            for (const element of receivedData) 
            {
                arr.push(processData(element, Object.assign({}, monoprice.singleZoneInfo)));
            }
            const allResults = addZoneNamesToZone(arr, dbResults);
       
            receivedData = [];
            res.status(200).json(allResults)
        }, 200);
        
     }catch(err)
     {
         res.status(400).send(err)
     }
 });

router.get('/:zoneId', (req,res) =>
{
    if(!(req.params['zoneId'] >= 10 && req.params['zoneId'] <= 16))
    {
        return res.status(400).send('invalid request');
    }
    const zoneQuery = `?${req.params['zoneId']}\r`;
    connection.processInput(zoneQuery);
    console.log(receivedData);
    setTimeout(() => 
    {
        let arr = [];
        for (const element of receivedData) 
        {
            arr.push(processData(element, Object.assign({}, monoprice.singleZoneInfo)));
            
        }
        res.send(arr);
        receivedData = [];
    }, 200);

});


function processData(data, zoneInfo)
{

    let rawData = data.replace(/\D/g, ''); 
    for(let i =2, j=0; i<=rawData.length; i+=2,j+=1)
    {
        var tempKey = Object.keys(zoneInfo)[j];
        zoneInfo[tempKey] = rawData.slice(i-2,i);
    }
    return zoneInfo;
}

function addZoneNamesToZone(ampZoneInfo, dbZoneInfo)
{
    ampZoneInfo.forEach((ampZone) =>
    {
        dbZoneInfo.forEach((dbZone) =>
        {
            if(ampZone.zoneId == dbZone.id)
            {
                ampZone.zoneName = dbZone.name;
            }
        })
    });
    return ampZoneInfo;    
}





/**
 * Following the Command control order Structure. The zoneId, the command and command input value (req.body) is received. 
 * All 3 variables are validated against the controlActions Object ./models/Monoprice. 
 */
router.post('/:zoneId/:attribute', (req,res) =>
{
    const validInput = validateZoneCommand(req.params['zoneId'], req.params['attribute'], req.body);
    console.log(validInput);
    if(validInput)
    {
        const controlOrder = `<${req.params['zoneId']}${req.params['attribute']}${req.body}\r`;
        console.log('command send to amp', controlOrder);
        processInput(controlOrder);
        res.status(200).send('success');
    }
    else
    {
        res.status(400).send('invalid')
    }
});

router.post('/:zoneId/', async (req,res) =>
{
    try{
        const zoneId = req.params['zoneId'];
        if(!(zoneId >= 10 && zoneId <= 16)) //validate amp, zone & input as int. 
        {
            return  res.status(400).send('invalid');
        }
        console.log('update name', zoneId, req.body );
        let zone = 
        {
            id: zoneId,
            name:  req.body,
        }
       
        const result = await db.updateZone(zone);
        res.status(200).json(result)
    }catch(err)
    {
        res.status(400).send('invalid')
    }
});


/* 
    Validate zoneId, the command and command input value against controlActions Object. 
*/
function validateZoneCommand(zoneId, command, input)
{

    if(!(zoneId >= 10 && zoneId <= 16)) //validate amp, zone & input as int. 
    {
        return false;
    }
    if(command in monoprice.controlActions)
    {
        return (input >= monoprice.controlActions[command][0] && input <= monoprice.controlActions[command][1]);
    }
}


function processInput(controlOrder)
{
    connection.port.write(controlOrder);
}

module.exports = router;
