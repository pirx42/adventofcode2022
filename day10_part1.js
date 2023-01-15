var fs = require('fs');
var path = require('path');
var filePath = './inputDay10.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let rolledInstructionsPerCycle = [];
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        const reCmdAddX = /addx (\S+)/g;
        match = reCmdAddX.exec(line);
        if (match) {
            rolledInstructionsPerCycle.push(0);
            rolledInstructionsPerCycle.push(parseInt(match[1]));
        }
        else { //noop
            rolledInstructionsPerCycle.push(0);
        }
    }
});

let registerValue = 1;
let summedSignalStrength = 0;
rolledInstructionsPerCycle.forEach((ipc, index) => {
    if (index == 20 || index == 60 || index == 100 || index == 140 || index == 180 || index == 220)
        summedSignalStrength += registerValue * index;
    registerValue += ipc;
});

console.log(summedSignalStrength);