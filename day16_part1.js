var fs = require('fs');
const { validateHeaderValue } = require('http');
var path = require('path');
var filePath = './inputDay16.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let valves = {};
let valveStates = {};
let simplifiedValveNetwork = {};
simplifiedValveNetwork['AA'] = { 'id': 'AA', 'to': [] };

input.split('\n').forEach((line) => {
    if (line.length > 0) {
        const regex = /Valve (\S+) has flow rate=(\S+); tunnels? leads? to valves? (.+)/g;
        let match = regex.exec(line);

        let rate = parseInt(match[2]);
        if (rate > 0) {
            valveStates[match[1]] = { 'rate': rate, 'open': false, 'timeOpened': 0 };
            simplifiedValveNetwork[match[1]] = { 'id': match[1], 'to': [] };
        }
        valves[match[1]] = {
            'id': match[1],
            'distance': 999,
            'to': match[3].split(', ')
        };
    }
});

for (const [id, valve] of Object.entries(valves)) {
    let toIDs = [...valve.to];
    valve.to = [];
    toIDs.forEach((id) => {
        valve.to.push(valves[id])
    });
};

//generate simplified network keeping only shortest connections to vales with rate > 0 with their distances.
for (const [id, valve] of Object.entries(simplifiedValveNetwork)) {
    //initialize distances
    for (const [id, valve] of Object.entries(valves)) { valve.distance = 999; }

    //generate shortest distances
    updateDistancesOfNeighbors(valves[id], 0);

    //setup connections to others
    for (const [otherId, otherValve] of Object.entries(simplifiedValveNetwork)) {
        if (otherId != id) {
            valve.to.push({ 'valve': otherValve, 'distance': valves[otherId].distance });
        }
    }
};


let bestScore = -1;
let bestHistory = '';

updatePressureOfNeighbors(simplifiedValveNetwork['AA'], 0, clone(valveStates), '');

console.log(bestScore + ' ' + bestHistory);


//helper
function updatePressureOfNeighbors(valve, time, valveStates, history) {
    if (time >= 30)
        return;

    history += ', ' + time + ' ' + totalRate(valveStates) + ' -> ' + valve.id;

    let timeConsumed = 0;
    let valveState = valveStates[valve.id];
    if (valveState && !valveState.open) {
        ++timeConsumed;
        history += ', ' + (time + timeConsumed) + ' ' + totalRate(valveStates) + ' O ' + valve.id;
        valveState.timeOpened = time + timeConsumed;
        valveState.open = true;
    }

    valve.to.forEach((toElement) => {
        let toValveState = valveStates[toElement.valve.id];
        if (toValveState && !toValveState.open) {
            updatePressureOfNeighbors(toElement.valve, time + timeConsumed + toElement.distance, clone(valveStates), [...history].join(''));
        }
    });

    let score = totalReleasedPressureAfter30Min(valveStates);
    if (score > bestScore) {
        bestScore = score;
        bestHistory = history;
    }
}

function updateDistancesOfNeighbors(valve, distance) {
    if (valve.distance < distance)
        return;
    valve.distance = distance;

    valve.to.forEach((toValve) => {
        updateDistancesOfNeighbors(toValve, distance + 1);
    });
}

function totalReleasedPressureAfter30Min(valveStates) {
    let sum = 0;
    for (const [id, valveState] of Object.entries(valveStates)) {
        if (valveState.open)
            sum += (30 - valveState.timeOpened) * valveState.rate;
    };
    return sum;
}

function maximalPossibleTotalReleasedPressureAfter30Min(time, valveStates) {
    let sum = 0;
    for (const [id, valveState] of Object.entries(valveStates)) {
        if (!valveState.open)
            sum += (30 - time) * valveState.rate;
    };
    return sum;
}

function releasedPressure(time, valveStates) {
    let sum = 0;
    for (const [id, valveState] of Object.entries(valveStates)) {
        if (valveState.open && (time - valveState.timeOpened) > 0)
            sum += (time - valveState.timeOpened) * valveState.rate;
    };
    return sum;
}

function totalRate(valveStates) {
    let rate = 0;
    for (const [id, valveState] of Object.entries(valveStates)) {
        if (valveState.open)
            rate += valveState.rate;
    };
    return rate;
}

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}