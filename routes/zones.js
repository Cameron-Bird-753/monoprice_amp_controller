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
const controlActions = require('../models/Monoprice.js');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')




//Serial Ports 
const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600,
    // parser: new ReadlineParser('\n')
  });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
// //Callbacks
// const queue = [];
// parser.on('data', readSerialData);

const queue = [];



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
    /**
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

    sendSync(port, '?10\r').then((data) => { //HARD CODED QUERY
        setTimeout(()=>{ 
            console.log(queue.length);
            res.json(queue);},200);
        // console.log(data);
       
    });







    // port.write('?11\r','ascii');
    // res.send('xxaabbccddeeffgghhiijj');
    
    // let dataReceived = data;

    // res.send(dataSet.toString());


});

function sendSync(port, src) {
    return new Promise((resolve, reject) => {
        port.write(src);
        parser.on('data', (data) => {console.log(data);
            resolve(queue.push(data));
        });

        port.on('error', (err) => {
            reject(err);
        });

        // setTimeout(()=>
        // {
            
        // }, 10)
        
    });
}

// router.get('/:zoneId', (req,res) =>
// {
//     res.send('xxaabbccddeeffgghhiijj');
// });

/**
 * Following the Command control order Structure. The zoneId, the command and command input value (req.body) is received. 
 * All 3 variables are validated against the controlActions Object ./models/Monoprice. 
 */
router.post('/:zoneId/:command', (req,res) =>
{
    const validInput = validateCommand(req.params['zoneId'], req.params['command'], req.body);
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
function validateCommand(zoneId, command, input)
{
    if(!(zoneId >= 10 && zoneId <= 16)) //validate amp, zone & input as int. 
    {
        return false;
    }
    if(command in controlActions)
    {
        if(!(input >= controlActions[command][0] && input <= controlActions[command][1])) //validate command's input value. 
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
    port.write(controlOrder);
}

module.exports = router;
