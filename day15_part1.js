var fs = require('fs');
var path = require('path');
var filePath = './inputDay15.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let sensorBeaconWithDistances = [];
let minX = 9999999999;
let maxX = -9999999999;
input.split('\n').forEach((line) => {
    if (line.length > 0) {
        const regex = /Sensor at x=(\S+), y=(\S+): closest beacon is at x=(\S+), y=(\S+)/g;
        match = regex.exec(line);
        let sensorPos = [parseInt(match[1]), parseInt(match[2])];
        let beaconPos = [parseInt(match[3]), parseInt(match[4])];
        let distance = manhattanDistance(sensorPos, beaconPos);
        sensorBeaconWithDistances.push([sensorPos, beaconPos, distance]);
        minX = Math.min(minX, sensorPos[0] - distance);
        maxX = Math.max(maxX, sensorPos[0] + distance);
    }
});

let mapWidth = maxX - minX + 1;
let targetMapRow = 2000000;
let coverageMapRow = new Array(mapWidth).fill(0);
sensorBeaconWithDistances.forEach((sensorBeaconWithDistance) => {
    let sensorPos = sensorBeaconWithDistance[0];
    let beaconPos = sensorBeaconWithDistance[1];
    if (sensorPos[1] == targetMapRow)
        coverageMapRow[sensorPos[0] - minX] = 2;
    if (beaconPos[1] == targetMapRow)
        coverageMapRow[beaconPos[0] - minX] = 3;
});

sensorBeaconWithDistances.forEach((sensorBeaconWithDistance) => {
    markCoverage(sensorBeaconWithDistance[0], sensorBeaconWithDistance[1], sensorBeaconWithDistance[2]);
});

console.log(coverageMapRow.filter((e) => e == 1).length);


//helper
function markCoverage(sensorPos, beaconPos, distance) {
    let deltaYToTargetY = Math.abs(sensorPos[1] - targetMapRow);

    if (distance < deltaYToTargetY)
        return;
    let a = distance - deltaYToTargetY;
    for (let i = sensorPos[0] - a - minX; i <= sensorPos[0] + a - minX; ++i) {
        if (coverageMapRow[i] == 0)
            coverageMapRow[i] = 1;
    }
}

function sub(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

function manhattanDistance(p1, p2) {
    let delta = sub(p1, p2);
    return Math.abs(delta[0]) + Math.abs(delta[1]);
}