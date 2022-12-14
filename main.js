var fs = require('fs');
var path = require('path');
var filePath = './inputDay14.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let minX = 999;
let maxX = -999;
let minY = 0;
let maxY = -999;

let scanlines = [];
input.split('\n').forEach((line) => {
    if (line.length > 0) {
        let scanline = [];
        line.split(' -> ').forEach((elements) => {
            let el = elements.split(',');
            let pos = [el[0], el[1]];
            minX = Math.min(minX, el[0]);
            maxX = Math.max(maxX, el[0]);
            maxY = Math.max(maxY, el[1]);
            scanline.push(pos);
        });
        scanlines.push(scanline);
    }
});

const OUT = -1;
const EMPTY = 0;
const ROCK = 1;
const SAND = 2;

let mapOffset = [minX, minY];
let mapWidth = maxX - minX + 1;
let mapHeight = maxY - minY + 1;
let simulationStateMap = new Array(mapHeight);
for (let y = 0; y < mapHeight; ++y) {
    simulationStateMap[y] = new Array(mapWidth).fill(EMPTY);
}

//setup map
scanlines.forEach((scanline) => {
    for (let i = 0; i < scanline.length - 1; ++i) {
        drawLine(sub(scanline[i], mapOffset), sub(scanline[i + 1], mapOffset));
    }
});

//simulate
let possibleNextPositions = [[0, 1], [-1, 1], [1, 1]];
let sandSpawnPosition = [500 - minX, 0];
let numRestedSands = 0;
let sandFlowingOut = false;

while (true) {
    let currentSandPosition = sandSpawnPosition;
    let currentSandRests = false;

    while (!currentSandRests && !sandFlowingOut) {

        currentSandRests = true;
        for (let i = 0; i < possibleNextPositions.length; ++i) {
            let next = add(currentSandPosition, possibleNextPositions[i]);
            if (elementAt(next) == EMPTY) {
                currentSandPosition = next;
                currentSandRests = false;
                break;
            }
            else if (elementAt(next) == OUT) {
                sandFlowingOut = true;
                break;
            }
        }
    }
    if (sandFlowingOut)
        break;

    ++numRestedSands;
    simulationStateMap[currentSandPosition[1]][currentSandPosition[0]] = SAND;
}


console.log(numRestedSands);


//helper
function drawLine(from, to) {
    let delta = normalize(sub(to, from));
    let current = [...from];
    while (!equal(current, to)) {
        simulationStateMap[current[1]][current[0]] = ROCK;
        current = add(current, delta);
    }
    simulationStateMap[current[1]][current[0]] = ROCK;
}

function elementAt(pos) {
    if (pos[0] < 0 || pos[0] >= simulationStateMap[0].length ||
        pos[1] < 0 || pos[1] >= simulationStateMap.length)
        return OUT;
    return simulationStateMap[pos[1]][pos[0]];
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function sub(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

function normalize(dir) {
    let length = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
    if (length > 0)
        return [Math.trunc(dir[0] / length), Math.trunc(dir[1] / length)];
    return dir;
}

function sign(value) {
    if (value >= 0)
        return 1;
    else
        return -1;
}

function equal(p1, p2) {
    return p1[0] == p2[0] && p1[1] == p2[1];
}