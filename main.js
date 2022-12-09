var fs = require('fs');
var path = require('path');
var filePath = './inputDay9.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

// let testInput = 'R 4\n\
// U 4\n\
// L 3\n\
// D 1\n\
// R 4\n\
// D 1\n\
// L 5\n\
// R 2\n';

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
let tailPositions = [];
for (let i = 1; i < 10; ++i)
    tailPositions.push([0, 0]);

let tailVisitedMap = new Set();

rolledOutMotions.forEach((element) => {
    headPosition[0] += element[0];
    headPosition[1] += element[1];

    updateTail(headPosition, tailPositions[0]);
    updateTail(tailPositions[0], tailPositions[1]);
    updateTail(tailPositions[1], tailPositions[2]);
    updateTail(tailPositions[2], tailPositions[3]);
    updateTail(tailPositions[3], tailPositions[4]);
    updateTail(tailPositions[4], tailPositions[5]);
    updateTail(tailPositions[5], tailPositions[6]);
    updateTail(tailPositions[6], tailPositions[7]);
    updateTail(tailPositions[7], tailPositions[8]);
    tailVisitedMap.add(tailPositions[8][0].toString() + '|' + tailPositions[8][1].toString());
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