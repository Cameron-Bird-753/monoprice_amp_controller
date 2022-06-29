const binaryOptions = [0,1];
const trebleAndBass = [0,14];
const channels = [1,6];
const volume = [0,38];


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

const controlActions = {
    "pr":binaryOptions,
    "mu":binaryOptions,
    "dt":binaryOptions,
    "vo":volume,
    "tr":trebleAndBass,
    "bs":trebleAndBass,
    "ch":channels,
}


const singleZoneInfo = 
{
    "zoneId":"",
    "paPower":"",
    "power":"",
    "mute":"",
    "doNotDisturb":"",
    "volume":"",
    "treble":"",
    "bass":"",
    "balance":"",
    "sourceChannelName":"",
    "keypadStatus":"",
    "zoneName":"",
};

module.exports = {controlActions, singleZoneInfo};