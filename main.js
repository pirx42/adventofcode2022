var fs = require('fs');
var path = require('path');
var filePath = './inputDay22.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const FREE = '.';
const OUT = ' ';
const ROCK = '#';

let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

let mapOffset = [0, 0];
let simulationMap = [];
let maxRowLength = 0;
let lines = input.split('\n');
lines.every((line) => {
    if (line.length > 0) {
        let row = [...line];
        simulationMap.push(row);
        maxRowLength = Math.max(maxRowLength, row.length);
        return true;
    }
    return false;
});

for (let i = 0; i < simulationMap.length; ++i) {
    simulationMap[i].push(...new Array(maxRowLength - simulationMap[i].length).fill(OUT));
}

let tileWidth = 50;
let tileHeight = 50;
let tiles = [
    { id: 0, offset: [1 * 50, 0], neighbors: { '0': [1, 0], '1': [2, 1], '2': [3, 0], '3': [5, 0] } }, //neighbors per outgoing direction: <tileid, incoming direction>
    { id: 1, offset: [2 * 50, 0], neighbors: { '0': [4, 2], '1': [2, 2], '2': [0, 2], '3': [5, 3] } },
    { id: 2, offset: [1 * 50, 1 * 50], neighbors: { '0': [1, 3], '1': [4, 1], '2': [3, 1], '3': [0, 3] } },
    { id: 3, offset: [0 * 50, 2 * 50], neighbors: { '0': [4, 0], '1': [5, 1], '2': [0, 0], '3': [2, 0] } },
    { id: 4, offset: [1 * 50, 2 * 50], neighbors: { '0': [1, 2], '1': [5, 2], '2': [3, 2], '3': [2, 3] } },
    { id: 5, offset: [0 * 50, 3 * 50], neighbors: { '0': [4, 3], '1': [1, 1], '2': [0, 1], '3': [3, 3] } },
]

let commands = lines[lines.length - 2].split(/([LR])/g);

let currentTile = 0;
let currentPosition = [0, 0];
let currentDirection = 0;

commands.forEach((cmd) => {
    if (cmd == 'L') {
        currentDirection = (currentDirection - 1 + directions.length) % directions.length;
    } else if (cmd == 'R') {
        currentDirection = (currentDirection + 1 + directions.length) % directions.length;
    }
    else {
        let steps = parseInt(cmd);
        for (let i = 0; i < steps; ++i) {
            let nextTile = currentTile;
            let nextDirection = structuredClone(currentDirection);
            let nextPosition = add(currentPosition, directions[currentDirection]);
            if (nextPosition[0] < 0 || nextPosition[0] >= tileWidth ||
                nextPosition[1] < 0 || nextPosition[1] >= tileHeight) {
                [nextTile, nextPosition, nextDirection] = doTileTransition(currentTile, nextPosition, currentDirection);
            }

            globalNextPos = tileToGlobalPos(nextTile, nextPosition);
            if (elementAt(globalNextPos) == ROCK) {
                break;
            } else {
                currentTile = nextTile;
                currentPosition = nextPosition;
                currentDirection = nextDirection;
            }
        }
    }
});


let globalFinalPosition = tileToGlobalPos(currentTile, currentPosition);
console.log('final position: ' + globalFinalPosition);
console.log('final direction: ' + currentDirection);
console.log('password: ' + ((globalFinalPosition[1] + 1) * 1000 + (globalFinalPosition[0] + 1) * 4 + currentDirection));


function doTileTransition(currentTileId, nextPosition, currentDirection) {
    let currentTile = tiles[currentTileId];
    let nextTileId = currentTile.neighbors[currentDirection][0];
    let nextDirection = currentTile.neighbors[currentDirection][1];

    let newNextPosition = structuredClone(nextPosition);
    if (Math.abs((currentDirection % 2) - (nextDirection % 2)) == 1) {
        [newNextPosition[0], newNextPosition[1]] = [newNextPosition[1], newNextPosition[0]];
        newNextPosition = add(newNextPosition, directions[nextDirection]);
    }
    else if (currentDirection == nextDirection) {
        newNextPosition[0] = (newNextPosition[0] + tileWidth) % tileWidth;
        newNextPosition[1] = (newNextPosition[1] + tileHeight) % tileHeight;
    }
    else if (Math.abs(currentDirection - nextDirection) == 2) {
        newNextPosition = add(newNextPosition, directions[nextDirection]);
        newNextPosition[1] = tileHeight - 1 - newNextPosition[1];
    }
    return [nextTileId, newNextPosition, nextDirection];
}


function tileToGlobalPos(tile, pos) {
    return add(tiles[tile].offset, pos);
}

function globalToTilePos(tile, pos) {
    return sub(pos, tiles[tile].offset);
}

function drawMap() {
    for (let i = 0; i < simulationMap.length; ++i) {
        console.log(i + ': ' + (simulationMap[i].join('')));
    }
}

function elementAt(pos) {
    let p = sub(pos, mapOffset);
    if (p[0] < 0 || p[0] >= simulationMap[0].length ||
        p[1] < 0 || p[1] >= simulationMap.length)
        return OUT;
    return simulationMap[p[1]][p[0]];
}

function setElementAt(pos, element) {
    let p = sub(pos, mapOffset);
    if (p[0] < 0 || p[0] >= simulationMap[0].length ||
        p[1] < 0 || p[1] >= simulationMap.length)
        return;
    simulationMap[p[1]][p[0]] = element;
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function sub(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

function mul(p, t) {
    return [p[0] * t, p[1] * t];
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