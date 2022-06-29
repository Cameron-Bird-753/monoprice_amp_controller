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

const connection = require('../util/portconfig');

connection.parser.on('data', readSerialData);
let receivedData = [];

function readSerialData(data)
{
  console.log('read serial data',data.length)
  if(data.length === 25)
  {
    console.log('pushing');
    receivedData.push(data);
  }
  return data;
} 




/**
 * Query spefic zone, or all zones for specific amp by using 10/20/30. 
 * Query structure -> '?xx"CR"':
 *      xx-> zone, or zones in question (amp number (10,20 or 30) + zone (1-6))
 *      "CR" ->Carrage return
 *  Reponse from amp - >'xxaabbccddeeffgghhiijj'"CR":
 *      xx -> see above
 *      aa -> PA control Status
 *      bb -> Power Control Status 
 *      cc -> Mute Status
 *      dd -> do not disturb Status
 *      ee -> Volume Status    
 *      ff -> Treble Status
 *      gg -> Bass Status 
 *      hh -> Balance Status
 *      ii -> Source Status
 *      jj -> Keypad Status
 */
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
        for (let index = 0; index < receivedData.length; index++) 
        {
            arr.push(processData(receivedData[index], Object.assign({}, monoprice.singleZoneInfo)));
            
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


function sendSync(port, src) 
{
    return new Promise((resolve, reject) => {
        connection.port.write(src);
        connection.parser.on('data', (data) => 
        {

            resolve(connection.queue.push(data));
        });

        connection.port.on('error', (err) => {
            reject(err);
        });
    });
}


/**
 * Following the Command control order Structure. The zoneId, the command and command input value (req.body) is received. 
 * All 3 variables are validated against the controlActions Object ./models/Monoprice. 
 */
router.post('/:zoneId/:command', (req,res) =>
{
    const validInput = validateZoneCommand(req.params['zoneId'], req.params['command'], req.body);
    console.log(validInput);
    if(validInput)
    {
        const controlOrder = `<${req.params['zoneId']}${req.params['command']}${req.body}\r`;
        console.log(controlOrder);
        processInput(controlOrder);
        res.send('success');
    }
    else
    {
        res.send('invalid')
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
        if(!(input >= monoprice.controlActions[command][0] && input <= monoprice.controlActions[command][1])) //validate command's input value. 
        {
            return false;
        }
        else
        {
            return true;
        }
    }
}


function processInput(controlOrder)
{
    connection.port.write(controlOrder);
}

module.exports = router;
