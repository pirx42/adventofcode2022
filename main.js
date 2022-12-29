var fs = require('fs');
var path = require('path');
var filePath = './inputDay24.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const FREE = '.';
const BORDER = '#';

let simulationPeriodicLength = 900; //lcm of 36 and 100

let neighbors = [[1, 0], [0, 1], [-1, 0], [0, -1]];
let directions = { '>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1] };

let mapOffset = [0, 0];
let blizzards = [];
let simulationStateMap = [];
let simulationStateMapOverTime = [];
input.split('\n').forEach((line, rowIndex) => {
    if (line.length > 0) {
        let row = [...line];
        simulationStateMap.push(row);

        let rowOverTime = new Array(row.length);
        for (let i = 0; i < row.length; ++i)
            rowOverTime[i] = new Map();
        simulationStateMapOverTime.push(rowOverTime);

        row.forEach((element, columnIndex) => {
            if (element != BORDER && element != FREE)
                blizzards.push({
                    'initialPosition': [columnIndex, rowIndex],
                    'direction': directions[element],
                    'symbol': element
                });
        });
    }
});

let startPosition = [1, 0];
let targetPosition = [simulationStateMap[0].length - 2, simulationStateMap.length - 1];

console.log('precalcing..');
for (let time = 0; time < simulationPeriodicLength; ++time) {
    setupSimulationMap(time);

    for (let i = 0; i < simulationStateMap.length; ++i) {
        for (let j = 0; j < simulationStateMap[i].length; ++j) {
            if (simulationStateMap[i][j] == FREE)
                simulationStateMapOverTime[i][j].set(time, 9999); //time -> distance
        }
    }
}


console.log('searching..');
updateDistancesOfNeighbors(startPosition, 0, 0);

let entriesAtTarget = simulationStateMapOverTime[targetPosition[1]][targetPosition[0]];
let shortestTimeA = [...entriesAtTarget.values()].sort()[0];
console.log(shortestTimeA);


for (let i = 0; i < simulationStateMapOverTime.length; ++i)
    for (let j = 0; j < simulationStateMapOverTime[i].length; ++j)
        simulationStateMapOverTime[i][j].forEach((value, key, map) => map.set(key, 9999));

[startPosition, targetPosition] = [targetPosition, startPosition];

updateDistancesOfNeighbors(startPosition, shortestTimeA % simulationPeriodicLength, 0);

entriesAtTarget = simulationStateMapOverTime[targetPosition[1]][targetPosition[0]];
let shortestTimeB = [...entriesAtTarget.values()].sort()[0];
console.log(shortestTimeB);


for (let i = 0; i < simulationStateMapOverTime.length; ++i)
    for (let j = 0; j < simulationStateMapOverTime[i].length; ++j)
        simulationStateMapOverTime[i][j].forEach((value, key, map) => map.set(key, 9999));

[startPosition, targetPosition] = [targetPosition, startPosition];

updateDistancesOfNeighbors(startPosition, (shortestTimeA + shortestTimeB) % simulationPeriodicLength, 0);

entriesAtTarget = simulationStateMapOverTime[targetPosition[1]][targetPosition[0]];
let shortestTimeC = [...entriesAtTarget.values()].sort()[0];
console.log(shortestTimeC);

console.log('total ' + (shortestTimeA + shortestTimeB + shortestTimeC));


function updateDistancesOfNeighbors(current, timeInSimulationPeriod, distance) {
    if (distance > 500)
        return;
    if (current[0] < 0 || current[0] >= simulationStateMapOverTime[0].length ||
        current[1] < 0 || current[1] >= simulationStateMapOverTime.length)
        return;

    let entriesAtCurrent = simulationStateMapOverTime[current[1]][current[0]];
    let foundDistance = entriesAtCurrent.get(timeInSimulationPeriod);
    if (foundDistance === undefined || foundDistance <= distance)
        return;
    entriesAtCurrent.set(timeInSimulationPeriod, distance);

    neighbors.forEach((neighbor) => {
        let next = add(current, neighbor);
        updateDistancesOfNeighbors(next, (timeInSimulationPeriod + 1) % simulationPeriodicLength, distance + 1);
    });

    updateDistancesOfNeighbors(current, (timeInSimulationPeriod + 1) % simulationPeriodicLength, distance + 1);
}



//helper
function setupSimulationMap(time) {
    for (let i = 1; i < simulationStateMap.length - 1; ++i)
        for (let j = 1; j < simulationStateMap[i].length - 1; ++j)
            simulationStateMap[i][j] = FREE;

    setElementAt(startPosition, FREE);
    setElementAt(targetPosition, FREE);

    blizzards.forEach((blizzard) => {
        let position = add(blizzard.initialPosition, mul(blizzard.direction, time));
        position[0] = (position[0] - 1 + 9999999 * (simulationStateMap[0].length - 2)) % (simulationStateMap[0].length - 2) + 1;
        position[1] = (position[1] - 1 + 9999999 * (simulationStateMap.length - 2)) % (simulationStateMap.length - 2) + 1;

        if (elementAt(position) != FREE)
            setElementAt(position, 'O');
        else
            setElementAt(position, blizzard.symbol);
    });
}

function drawMap() {
    for (let i = 0; i < simulationStateMap.length; ++i) {
        console.log(i + ': ' + (simulationStateMap[i].join('')));
    }
}

function elementAt(pos) {
    let p = sub(pos, mapOffset);
    if (p[0] < 0 || p[0] >= simulationStateMap[0].length ||
        p[1] < 0 || p[1] >= simulationStateMap.length)
        return BORDER;
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