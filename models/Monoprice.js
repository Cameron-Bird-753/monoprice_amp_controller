const binaryOptions = [0,1];
const trebleAndBass = [0,14];
const channels = [1,6];
const volume = [0,38];




const controlActions = {
    "pr":binaryOptions,
    "mu":binaryOptions,
    "dt":binaryOptions,
    "vo":volume,
    "tr":trebleAndBass,
    "bs":trebleAndBass,
    "ch":channels,
}


const singleZoneInfo = {
    "zone":"",
    "pa":"",
    "power":"",
    "mute":"",
    "dnd":"",
    "vol":"",
    "treb":"",
    "bass":"",
    "balance":"",
    "source":"",
    "keypad":"",
};

// const data = [
//     "?11",
//     "#>1100010000111109100601\r",];

// module.exports = singleZoneInfo;
// module.exports = controlCommand;
module.exports = {controlActions, singleZoneInfo};