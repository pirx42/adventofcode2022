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
let contentOfCRT = '';
rolledInstructionsPerCycle.forEach((ipc, index) => {
    updateCRT(registerValue, index + 1);
    registerValue += ipc;
});

drawCRT();

//helper
function updateCRT(position, cycle) {
    let crtPosition = (cycle - 1) % 40;
    if (position - 1 <= crtPosition && position + 1 >= crtPosition)
        contentOfCRT += '#';
    else
        contentOfCRT += '.';
}

function drawCRT() {
    console.log(contentOfCRT.slice(0, 39));
    console.log(contentOfCRT.slice(40, 79));
    console.log(contentOfCRT.slice(80, 119));
    console.log(contentOfCRT.slice(120, 159));
    console.log(contentOfCRT.slice(160, 199));
    console.log(contentOfCRT.slice(200, 239));
}
