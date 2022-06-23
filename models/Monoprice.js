const binaryOptions = [0,1];
const trebleAndBass = [0,14];
const channels = [1,6];




const controlCommand = {
    "pr":binaryOptions,
    "mu":binaryOptions,
    "dt":binaryOptions,
    "vo":binaryOptions,
    "tr":trebleAndBass,
    "bs":trebleAndBass,
    "ch":channels,
}

module.exports = controlCommand;
