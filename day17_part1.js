var fs = require('fs');
var path = require('path');
var filePath = './inputDay17.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));

let commands = [...buffer.toString()];
commands.pop();//remove line break

const OUT = -1;
const FREE = 0;
const ROCK = 1;

let rockShape1 = { id: 1, height: 1, parts: [[0, 0], [1, 0], [2, 0], [3, 0]] };
let rockShape2 = { id: 2, height: 3, parts: [[1, 0], [0, -1], [1, -1], [2, -1], [1, -2]] };
let rockShape3 = { id: 3, height: 3, parts: [[0, 0], [1, 0], [2, 0], [2, -1], [2, -2]] };
let rockShape4 = { id: 4, height: 4, parts: [[0, 0], [0, -1], [0, -2], [0, -3]] };
let rockShape5 = { id: 5, height: 2, parts: [[0, 0], [1, 0], [0, -1], [1, -1]] };

let rockShapes = [rockShape1, rockShape2, rockShape3, rockShape4, rockShape5];

let currentMovingRockIdx = 0;
let currentCommandIdx = 0;
let currentMaximalRockHigh = 0;

let stoppedRocks = [];

const MAP_WIDTH = 7;
let simulationStateMap = [];

while (stoppedRocks.length < 2022) {

    let rockShape = rockShapes[currentMovingRockIdx % rockShapes.length];
    ++currentMovingRockIdx;
    let currentPosition = [2, rockShape.height - 1];
    let rowsToAdd = rockShape.height + 3 + currentMaximalRockHigh - simulationStateMap.length
    if (rowsToAdd > 0) {
        for (let i = 0; i < rowsToAdd; ++i)
            simulationStateMap.unshift(new Array(MAP_WIDTH).fill(FREE));
    }
    else {
        for (let i = 0; i < Math.abs(rowsToAdd); ++i)
            simulationStateMap.shift();
    }

    while (true) {
        let command = commands[currentCommandIdx % commands.length];
        ++currentCommandIdx;
        let nextPosition = add(currentPosition, command == '<' ? [-1, 0] : [1, 0]);

        if (!hasCollision(rockShape, nextPosition)) {
            currentPosition = nextPosition;
        }

        nextPosition = add(currentPosition, [0, 1]);
        if (hasCollision(rockShape, nextPosition)) {
            setShapeAt(rockShape, currentPosition);
            stoppedRocks.push({ position: currentPosition, shape: rockShape });
            let shapeRockHigh = simulationStateMap.length - currentPosition[1] + (rockShape.height - 1);
            currentMaximalRockHigh = Math.max(currentMaximalRockHigh, shapeRockHigh);
            break;
        }
        else {
            currentPosition = nextPosition;
        }
    }
}

console.log(currentMaximalRockHigh);


//helper
function hasCollision(shape, position) {
    for (let i = 0; i < shape.parts.length; ++i) {
        let partPos = add(position, shape.parts[i]);
        if (elementAt(partPos) != FREE)
            return true;
    }
    return false;
}

function setShapeAt(shape, pos) {
    shape.parts.forEach((part) => {
        setElementAt(add(pos, part), ROCK);
    });
}

function drawMap() {
    for (let i = 0; i < simulationStateMap.length; ++i) {
        console.log(i + ': ' + (simulationStateMap[i].map((e) => {
            if (e == 0)
                return '.'
            else
                return '#';
        }).join('')));
    }
}

function elementAt(pos) {
    if (pos[0] < 0 || pos[0] >= simulationStateMap[0].length ||
        pos[1] < 0 || pos[1] >= simulationStateMap.length)
        return OUT;
    return simulationStateMap[pos[1]][pos[0]];
}

function setElementAt(pos, element) {
    if (pos[0] < 0 || pos[0] >= simulationStateMap[0].length ||
        pos[1] < 0 || pos[1] >= simulationStateMap.length)
        return;
    simulationStateMap[pos[1]][pos[0]] = element;
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
