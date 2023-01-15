var fs = require('fs');
var path = require('path');
var filePath = './inputDay09.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let rolledOutMotions = [];
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        const reCmdCDX = /(\S) (\d+)/g;
        match = reCmdCDX.exec(line);
        if (match[1] == 'U') {
            for (let i = 0; i < parseInt(match[2]); ++i)
                rolledOutMotions.push([0, -1]);
        }
        else if (match[1] == 'L') {
            for (let i = 0; i < parseInt(match[2]); ++i)
                rolledOutMotions.push([-1, 0]);
        }
        else if (match[1] == 'D') {
            for (let i = 0; i < parseInt(match[2]); ++i)
                rolledOutMotions.push([0, 1]);
        }
        else if (match[1] == 'R') {
            for (let i = 0; i < parseInt(match[2]); ++i)
                rolledOutMotions.push([1, 0]);
        }
    }
});

let headPosition = [0, 0];
let tailPosition = [0, 0];
let tailVisitedMap = new Set();

rolledOutMotions.forEach((element) => {
    headPosition[0] += element[0];
    headPosition[1] += element[1];

    updateTail(headPosition, tailPosition);
    tailVisitedMap.add(tailPosition[0].toString() + '|' + tailPosition[1].toString());
});

console.log(tailVisitedMap.size);


function updateTail(headPosition, tailPosition) {
    let headTailOffset = [headPosition[0] - tailPosition[0], headPosition[1] - tailPosition[1]];
    if (Math.abs(headTailOffset[0]) <= 1 && Math.abs(headTailOffset[1]) <= 1)
        return;
    let tailMotion = headTailOffset;
    if (tailMotion[0] > 1)
        tailMotion[0] = 1;
    else if (tailMotion[0] < -1)
        tailMotion[0] = -1;
    if (tailMotion[1] > 1)
        tailMotion[1] = 1;
    else if (tailMotion[1] < -1)
        tailMotion[1] = -1;
    tailPosition[0] += tailMotion[0];
    tailPosition[1] += tailMotion[1];
}