var fs = require('fs');
var path = require('path');
var filePath = './inputDay15.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let dim = 4000000;
let sensorWithDistances = [];
let minX = 0;
let maxX = dim;
input.split('\n').forEach((line) => {
    if (line.length > 0) {
        const regex = /Sensor at x=(\S+), y=(\S+): closest beacon is at x=(\S+), y=(\S+)/g;
        match = regex.exec(line);
        let sensorPos = [parseInt(match[1]), parseInt(match[2])];
        let beaconPos = [parseInt(match[3]), parseInt(match[4])];
        let distance = manhattanDistance(sensorPos, beaconPos);
        sensorWithDistances.push([sensorPos, distance]);
    }
});

let mapWidth = maxX - minX + 1;

for (let row = 0; row < dim; ++row) {

    let ranges = [];
    sensorWithDistances.forEach((sensorWithDistance) => {
        let sensorPos = sensorWithDistance[0];
        let distance = sensorWithDistance[1];
        let deltaYToTargetY = Math.abs(sensorPos[1] - row);

        if (distance >= deltaYToTargetY) {
            let a = distance - deltaYToTargetY;
            let start = sensorPos[0] - a - minX;
            start = Math.max(start, minX);
            let end = sensorPos[0] + a - minX;
            end = Math.min(end, maxX);
            ranges.push([start, end]);
        }
    });

    ranges.sort((a, b) => a[0] - b[0]);
    let combinationDone = true;
    while (combinationDone && ranges.length > 1) {
        let newRanges = [];
        let rangeA = ranges[0];
        combinationDone = false;
        for (let i = 1; i < ranges.length; ++i) {
            let rangeB = ranges[i];
            let combinedRange = combineRange(rangeA, rangeB);
            if (combinedRange) {
                newRanges.push(combinedRange);
                for (let j = i + 1; j < ranges.length; ++j)
                    newRanges.push(ranges[j]);
                combinationDone = true;
                break;
            }
            else {
                newRanges.push(rangeB);
            }
        }
        ranges = newRanges;
    }

    if (ranges.length > 1) {
        let coverageMapRow = new Array(mapWidth).fill(0);
        sensorWithDistances.forEach((sensorWithDistance) => {
            markCoverage(coverageMapRow, sensorWithDistance[0], sensorWithDistance[1], row);
        });
        let col = coverageMapRow.findIndex((e) => e == 0);
        console.log(row + ', ' + col + ': ' + (col * 4000000 + row));
        // console.log([...coverageMapRow].join(''));
        break;
    }
}

//helper
function markCoverage(coverageMapRow, sensorPos, distance, row) {
    let deltaYToTargetY = Math.abs(sensorPos[1] - row);

    if (distance < deltaYToTargetY)
        return;
    let a = distance - deltaYToTargetY;
    let start = sensorPos[0] - a - minX;
    start = Math.max(start, minX);
    let end = sensorPos[0] + a - minX;
    end = Math.min(end, maxX);
    for (let i = start; i <= end; ++i) {
        coverageMapRow[i] = 1;
    }
}

function combineRange(rangeA, rangeB) {
    let rangeAEndInsideRangeB = rangeA[1] >= rangeB[0] && rangeA[1] <= rangeB[1];
    let rangeBEndInsideRangeA = rangeB[1] >= rangeA[0] && rangeB[1] <= rangeA[1];
    if (rangeAEndInsideRangeB || rangeBEndInsideRangeA)
        return [Math.min(rangeA[0], rangeB[0]), Math.max(rangeA[1], rangeB[1])];
    return null;
}

function sub(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

function manhattanDistance(p1, p2) {
    let delta = sub(p1, p2);
    return Math.abs(delta[0]) + Math.abs(delta[1]);
}

