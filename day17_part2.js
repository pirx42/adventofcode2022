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

const MAP_WIDTH = 7;
let simulationStateMap = [];

//the target simulation count is too high for any calculation. there must be some kind of periodicity in the simulation.
//this needs to be found.
//after analyzing the simulated rocks visually we notice that after rock high of 136 the simulation repeats with periodic length of 2548 high.
//those hights corresponds to 91 and 1690 fallen rocks. that means we only need to simulate the first 91 rocks plus the remainder of (1000000000000 - 91) / 1690 = 469 rocks.
//so in total 560 rocks need to be simulated.
//afterwards we can calculate the reached high by trunc((1000000000000 - 91) / 1690) * 2548 plus the simulated high.

let rockFallsToSimulate = 91 + (1000000000000 - 91) % 1690;

while (currentMovingRockIdx < rockFallsToSimulate) {

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
            let shapeRockHigh = simulationStateMap.length - currentPosition[1] + (rockShape.height - 1);
            currentMaximalRockHigh = Math.max(currentMaximalRockHigh, shapeRockHigh);
            break;
        }
        else {
            currentPosition = nextPosition;
        }
    }
}

let totalReachedHigh = currentMaximalRockHigh + Math.trunc((1000000000000 - 91) / 1690) * 2548;
console.log(totalReachedHigh);


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
        console.log((simulationStateMap[i].map((e) => {
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
