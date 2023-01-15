var fs = require('fs');
var path = require('path');
var filePath = './inputDay16.txt';

//!this is not an optimal solution as it take several hours to finish!
//optimal valve opening order for total pressure of 2261:
//agent A: 3 IZ, 7 CU, 11 QZ, 15 TU, 18 UZ, 21 YL, 24 PA
//agent B: 4 TR, 7 FF, 10 GG, 13 ZL, 16 OI, 24 SZ

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let maxTime = 26;

const startId = 'AA';
let originalValveNetwork = {};
let valveStates = new Map();
let simplifiedValveNetwork = {};
simplifiedValveNetwork[startId] = { 'id': startId, 'to': [] };

input.split('\n').forEach((line) => {
    if (line.length > 0) {
        const regex = /Valve (\S+) has flow rate=(\S+); tunnels? leads? to valves? (.+)/g;
        let match = regex.exec(line);

        let rate = parseInt(match[2]);
        if (rate > 0) {
            valveStates.set(match[1], { 'rate': rate, 'open': false, 'timeOpened': 0 });
            simplifiedValveNetwork[match[1]] = { 'id': match[1], 'to': [] };
        }
        originalValveNetwork[match[1]] = {
            'id': match[1],
            'distance': 999,
            'to': match[3].split(', ')
        };
    }
});

for (const [id, valve] of Object.entries(originalValveNetwork)) {
    let toIDs = [...valve.to];
    valve.to = [];
    toIDs.forEach((id) => {
        valve.to.push(originalValveNetwork[id])
    });
};

//generate simplified network keeping only shortest connections to vales with rate > 0 with their distances.
for (const [id, valve] of Object.entries(simplifiedValveNetwork)) {
    //initialize distances
    for (const [id, valve] of Object.entries(originalValveNetwork)) { valve.distance = 999; }

    //generate shortest distances
    updateDistancesOfNeighbors(originalValveNetwork[id], 0);

    //setup connections to others except to 'AA'
    for (const [otherId, otherValve] of Object.entries(simplifiedValveNetwork)) {
        if (otherId != id && otherId != startId && originalValveNetwork[otherId].distance < 999) {
            valve.to.push({ 'valve': otherValve, 'distance': originalValveNetwork[otherId].distance });
        }
    }

    //order by rate/distance
    valve.to.sort((a, b) => valveStates.get(b.valve.id).rate / b.distance - valveStates.get(a.valve.id).rate / a.distance);
};

let maxPossibleTotalRate = 0;
valveStates.forEach((valveState, id) => {
    maxPossibleTotalRate += valveState.rate;
});

let bestScore = -1;
let bestHistory = '';
let checkedCombinations = 0;

updatePressureOfNeighbors(structuredClone(valveStates),
    simplifiedValveNetwork[startId], 0, '',
    simplifiedValveNetwork[startId], 0, '');

console.log('=================');
console.log('best overall ' + bestScore + ' ' + checkedCombinations + ' ' + bestHistory);


//helper
function updatePressureOfNeighbors(valveStates,
    valveA, targetTimeA, historyA,
    valveB, targetTimeB, historyB) {

    let minTargetTime = Math.min(targetTimeA, targetTimeB);
    if (minTargetTime >= maxTime)
        return;

    if (minTargetTime > maxTime / 2) {
        if (totalRate(valveStates) < maxPossibleTotalRate / 3)
            return;
    }

    if (targetTimeA < targetTimeB) {
        let valveOpened = false;
        [valveOpened, historyA] = tryOpenValve(targetTimeA, valveStates, valveA, historyA);
        if (!valveOpened)
            return;

        valveA.to.forEach((toElement) => {
            let toValveState = valveStates.get(toElement.valve.id);
            if (!toValveState.open) {
                updatePressureOfNeighbors(structuredClone(valveStates),
                    toElement.valve, targetTimeA + 1 + toElement.distance, structuredClone(historyA),
                    valveB, targetTimeB, structuredClone(historyB));
            }
        });
    }
    else if (targetTimeA > targetTimeB) {
        let valveOpened = false;
        [valveOpened, historyB] = tryOpenValve(targetTimeB, valveStates, valveB, historyB);
        if (!valveOpened)
            return;

        valveB.to.forEach((toElement) => {
            let toValveState = valveStates.get(toElement.valve.id);
            if (!toValveState.open) {
                updatePressureOfNeighbors(structuredClone(valveStates),
                    valveA, targetTimeA, structuredClone(historyA),
                    toElement.valve, targetTimeB + 1 + toElement.distance, structuredClone(historyB));
            }
        });
    }
    else { //targetTimeA == targetTimeB
        let timeConsumedA = 0;
        let timeConsumedB = 0;
        if (valveA.id != startId && valveB.id != startId) {
            if (valveA.id == valveB.id)
                return;

            let valveAOpened;
            [valveAOpened, historyA] = tryOpenValve(targetTimeA, valveStates, valveA, historyA);
            if (!valveAOpened)
                return;

            let valveBOpened;
            [valveBOpened, historyB] = tryOpenValve(targetTimeB, valveStates, valveB, historyB);
            if (!valveBOpened)
                return;

            timeConsumedA = 1;
            timeConsumedB = 1;
        }

        valveA.to.forEach((toElementA) => {
            let toValveStateA = valveStates.get(toElementA.valve.id);
            if (!toValveStateA.open) {
                valveB.to.forEach((toElementB) => {
                    if (toElementA.valve.id != toElementB.valve.id) {
                        let toValveStateB = valveStates.get(toElementB.valve.id);
                        if (!toValveStateB.open) {
                            updatePressureOfNeighbors(structuredClone(valveStates),
                                toElementA.valve, targetTimeA + timeConsumedA + toElementA.distance, structuredClone(historyA),
                                toElementB.valve, targetTimeB + timeConsumedB + toElementB.distance, structuredClone(historyB));
                        }
                    }
                });
            }
        });
    }

    ++checkedCombinations;

    let score = totalReleasedPressureAfterMaxTime(valveStates);
    if (score > bestScore) {
        bestScore = score;
        bestHistory = '\n' + historyA + '\n' + historyB;
        console.log('best so far ' + bestScore + ' ' + checkedCombinations + ' ' + bestHistory);
    }
}

function tryOpenValve(time, valveStates, valve, history) {
    let valveState = valveStates.get(valve.id);
    if (valveState && !valveState.open) {
        history += ', ' + (time + 1) + ' ' + valve.id;
        valveState.timeOpened = time + 1;
        valveState.open = true;
        return [true, history];
    }
    return [false, history];
}

function updateDistancesOfNeighbors(valve, distance) {
    if (valve.distance < distance)
        return;
    valve.distance = distance;

    //stop at valves with rate >0
    // if (valveStates.get(valve.id) && distance > 0)
    //     return;

    valve.to.forEach((toValve) => {
        updateDistancesOfNeighbors(toValve, distance + 1);
    });
}

function totalReleasedPressureAfterMaxTime(valveStates) {
    let sum = 0;
    valveStates.forEach((valveState, id) => {
        if (valveState.open)
            sum += (maxTime - valveState.timeOpened) * valveState.rate;
    });
    return sum;
}

function totalRate(valveStates) {
    let rate = 0;
    valveStates.forEach((valveState, id) => {
        if (valveState.open)
            rate += valveState.rate;
    });
    return rate;
}
