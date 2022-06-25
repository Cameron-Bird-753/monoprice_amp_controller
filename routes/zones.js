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
    /**
     * 
     * [
    "?11",
    "#>1100010000111109100601\r"
     
    [
    "?10",
    "#>1100010000111109100601\r",
    "#>1200000000170405100601\r",
    "#>1300000000280710100601\r",
    "#>1400000000200707100601\r",
    "#>1500000000200707100100\r",
    "#>1600000000250707100500\r"

    ]
    */
const mockData = [
    "?11",
    "#>1100010000111109100601\r"];






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

    const processedData = processData(mockData); //Should pass the queue I think
    console.log(processedData)
    res.json(processedData);

    sendSync(connection.port, '?10\r').then((data) => { //HARD CODED QUERY
        setTimeout(()=>
        { 
            console.log(queue.length);
            const processedData = processData(mockData); //Should pass the queue I think
            res.json(processedData);

        },200);
        // console.log(data);
    });


});


function processData(data)
{

    let rawData = data[1].replace(/\D/g, ''); 
    let zoneInfo = monoprice.singleZoneInfo;
    console.log(zoneInfo);
    console.log(rawData.length)
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
        connection.parser.on('data', (data) => {console.log(data);
            resolve(queue.push(data));
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

router.post('/source/:sourchId', (req,res) =>
{
    console.log('source');
    const validInput = validateSourceCommand(req.params['sourchId'], req.body);
    if(validInput)
    {
        let newSourceName = req.body.padStart(8);
        const controlOrder = `${req.params['sourchId']}<${newSourceName}\r`;
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

function processInput(controlOrder)
{
    connection.port.write(controlOrder);
}

module.exports = router;
