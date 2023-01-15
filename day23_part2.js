const { Console } = require('console');
var fs = require('fs');
var path = require('path');
var filePath = './inputDay23.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const NONE = -1;

const FREE = 0;
const ELF = 999;

const N = 0;
const NE = 1;
const E = 2;
const SE = 3;
const S = 4;
const SW = 5;
const W = 6;
const NW = 7;
const NumDirections = 8;

let directions = [];
directions[N] = [0, -1];
directions[NE] = [1, -1];
directions[E] = [1, 0];
directions[SE] = [1, 1];
directions[S] = [0, 1];
directions[SW] = [-1, 1];
directions[W] = [-1, 0];
directions[NW] = [-1, -1];

let checkAndMoveDirections =
    [[N, [N, NE, NW]],
    [S, [S, SE, SW]],
    [W, [W, NW, SW]],
    [E, [E, NE, SE]]];

let maxRounds = 100;
let elves = [];
input.split('\n').forEach((line, rowIndex) => {
    if (line.length > 0) {
        let row = [...line];
        row.forEach((element, columnIndex) => {
            if (element == '#')
                elves.push({ 'position': [columnIndex, rowIndex], 'previousMove': NONE, 'nextMove': NONE });
        });
    }
});

let minX = 999;
let maxX = -999;
let minY = 999;
let maxY = -999;
elves.forEach((elf) => {
    minX = Math.min(minX, elf.position[0]);
    maxX = Math.max(maxX, elf.position[0]);
    minY = Math.min(minY, elf.position[1]);
    maxY = Math.max(maxY, elf.position[1]);
});
let size = [maxX - minX + 1 + maxRounds * 2, maxY - minY + 1 + maxRounds * 2];
let mapOffset = [minX - 1 - maxRounds, minY - 1 - maxRounds];

let simulationStateMap = new Array(size[1]);
for (let i = 0; i < simulationStateMap.length; ++i)
    simulationStateMap[i] = new Array(size[0]).fill(FREE);

executeMovement();

let round = 0;
let elfWasMoved = true;
while (elfWasMoved) {
    prepareMovement(round);

    elfWasMoved = executeMovement();
    ++round;
}

console.log(round);

function prepareMovement(round) {
    elves.forEach((elf) => {

        let elfIsClose = false;
        for (let i = 0; i < NumDirections; ++i) {
            let next = add(elf.position, directions[i]);
            if (elementAt(next) >= ELF) {
                elfIsClose = true;
                break;
            }
        }

        if (elfIsClose) {
            for (let checkAndMoveDirectionIdx = 0; checkAndMoveDirectionIdx < checkAndMoveDirections.length; ++checkAndMoveDirectionIdx) {

                let cycledCheckAndMoveDirectionIdx = (checkAndMoveDirectionIdx + round) % checkAndMoveDirections.length;
                let checkAndMoveDirection = checkAndMoveDirections[cycledCheckAndMoveDirectionIdx];
                let moveDirection = checkAndMoveDirection[0];
                let checkDirections = checkAndMoveDirection[1];

                let foundElfInCheckDirections = false;
                for (let i = 0; i < checkDirections.length; ++i) {
                    let directionToCheck = directions[checkDirections[i]];
                    let next = add(elf.position, directionToCheck);
                    let mapEntry = elementAt(next);
                    if (mapEntry >= ELF) {
                        foundElfInCheckDirections = true;
                        break;
                    }
                }

                if (!foundElfInCheckDirections) {
                    let next = add(elf.position, directions[moveDirection]);
                    elf.nextMove = moveDirection;
                    setElementAt(next, elementAt(next) + 1);
                    break;
                }
            }
        }

    });
}

function executeMovement() {
    let elfWasMoved = false;
    elves.forEach((elf) => {
        if (elf.nextMove != NONE) {
            let newPosition = add(elf.position, directions[elf.nextMove]);
            let mapEntry = elementAt(newPosition);
            if (mapEntry == 1) {
                elf.position = newPosition;
                elfWasMoved = true;
            }
            elf.nextMove = NONE
        }
    });

    for (let i = 0; i < simulationStateMap.length; ++i)
        for (let j = 0; j < simulationStateMap[i].length; ++j)
            simulationStateMap[i][j] = 0;

    elves.forEach((elf) => {
        setElementAt(elf.position, ELF);
    });

    return elfWasMoved;
}



//helper
function drawMap() {
    for (let i = 0; i < simulationStateMap.length; ++i) {
        console.log(i + ': ' + (simulationStateMap[i].map((v) => v > 9 ? '#' : (v > 0 ? v : '.')).join('')));
    }
}

function elementAt(pos) {
    let p = sub(pos, mapOffset);
    if (p[0] < 0 || p[0] >= simulationStateMap[0].length ||
        p[1] < 0 || p[1] >= simulationStateMap.length)
        return FREE;
    return simulationStateMap[p[1]][p[0]];
}

function setElementAt(pos, element) {
    let p = sub(pos, mapOffset);
    if (p[0] < 0 || p[0] >= simulationStateMap[0].length ||
        p[1] < 0 || p[1] >= simulationStateMap.length)
        return;
    simulationStateMap[p[1]][p[0]] = element;
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
