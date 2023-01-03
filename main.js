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

let commands = lines[lines.length - 2].split(/([LR])/g);

let currentPosition = [simulationMap[0].findIndex((e) => e == FREE), 0];
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
            let next = add(currentPosition, directions[currentDirection]);
            if (elementAt(next) == OUT) {
                next = findOppositeInsideElement(currentPosition, currentDirection);
            }

            if (elementAt(next) == ROCK) {
                break;
            } else {
                currentPosition = next;
            }
            setElementAt(currentPosition, currentDirection.toString());
        }
    }
});


console.log('password: ' + ((currentPosition[1] + 1) * 1000 + (currentPosition[0] + 1) * 4 + currentDirection));

function findOppositeInsideElement(pos, direction) {
    let oppositeDirection = (direction + 2) % directions.length;
    let next = structuredClone(pos);
    while (elementAt(next) != OUT) {
        next = add(next, directions[oppositeDirection]);
    }
    return add(next, directions[direction]);
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