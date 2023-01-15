var fs = require('fs');
var path = require('path');
var filePath = './inputDay19.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const MAX_TIME = 32;
const ORE_ROBOT_ID = 0;
const CLAY_ROBOT_ID = 1;
const OBSIDIAN_ROBOT_ID = 2;
const GEODE_ROBOT_ID = 3;

let bluePrints = [];
let states = { oreRobots: 1, clayRobots: 0, obsidianRobots: 0, geodeRobots: 0, collectedOre: 0, collectedClay: 0, collectedObsidian: 0, collectedGeode: 0 };

input.split('\n').forEach((line) => {
    if (line.length > 0) {
        const regex = /Blueprint (\S+): Each ore robot costs (\S+) ore. Each clay robot costs (\S+) ore. Each obsidian robot costs (\S+) ore and (\S+) clay. Each geode robot costs (\S+) ore and (\S+) obsidian./g;
        let match = regex.exec(line);

        let bluePrint = {
            id: parseInt(match[1]),
            oreCosts: [parseInt(match[2]), parseInt(match[3]), parseInt(match[4]), parseInt(match[6])],
            clayCosts: [0, 0, parseInt(match[5]), 0],
            obsidianCosts: [0, 0, 0, parseInt(match[7])]
        };
        bluePrints.push(bluePrint);
    }
});

let results = [];

let bestScore = 0;
let timeFirstGeodeFound = 999;
let bluePrint = bluePrints[0];

for (let i = 0; i < 3; ++i) {
    bestScore = 0;
    timeFirstGeodeFound = 999;
    bluePrint = bluePrints[i];
    doNextStep(structuredClone(states), 1);
    results.push(bestScore);

    console.log((i + 1) + ' ' + bestScore);
}

console.log(results[0] * results[1] * results[2]);


//helper
function doNextStep(states, time) {

    let newStates = structuredClone(states);
    collectResources(newStates);

    if (newStates.collectedGeode > bestScore)
        bestScore = newStates.collectedGeode;

    if (newStates.collectedGeode > 0 && time < timeFirstGeodeFound)
        timeFirstGeodeFound = time;

    if (newStates.collectedGeode == 0 && time > timeFirstGeodeFound)
        return;

    if (time == MAX_TIME)
        return;

    let nextStates = [];
    {
        let newStates = structuredClone(states);
        let robotBuild = createRobot(time, GEODE_ROBOT_ID, bluePrint, newStates);
        collectResources(newStates);
        if (robotBuild) {
            newStates.geodeRobots++;
            nextStates.push(newStates);
        }
    }
    {
        let newStates = structuredClone(states);
        let robotBuild = createRobot(time, OBSIDIAN_ROBOT_ID, bluePrint, newStates);
        collectResources(newStates);
        if (robotBuild) {
            newStates.obsidianRobots++;
            nextStates.push(newStates);
        }
    }
    {
        let newStates = structuredClone(states);
        let robotBuild = createRobot(time, CLAY_ROBOT_ID, bluePrint, newStates);
        collectResources(newStates);
        if (robotBuild) {
            newStates.clayRobots++;
            nextStates.push(newStates);
        }
    }
    {
        let newStates = structuredClone(states);
        let robotBuild = createRobot(time, ORE_ROBOT_ID, bluePrint, newStates);
        collectResources(newStates);
        if (robotBuild) {
            newStates.oreRobots++;
            nextStates.push(newStates);
        }
    }

    if (nextStates.length == 0) {
        let newStates = structuredClone(states);
        let roundsToWaitToBuildNextOreRobot = Math.ceil((bluePrint.oreCosts[ORE_ROBOT_ID] - newStates.collectedOre) / newStates.oreRobots);
        let roundsToWaitToBuildNextClayRobot = Math.ceil((bluePrint.oreCosts[CLAY_ROBOT_ID] - newStates.collectedOre) / newStates.oreRobots);
        let roundsToWaitToBuildNextObsidianRobot = Math.max(Math.ceil((bluePrint.oreCosts[OBSIDIAN_ROBOT_ID] - newStates.collectedOre) / newStates.oreRobots),
            Math.ceil((bluePrint.clayCosts[OBSIDIAN_ROBOT_ID] - newStates.collectedClay) / newStates.clayRobots));
        let roundsToWaitToBuildNextGeodeRobot = Math.max(Math.ceil((bluePrint.oreCosts[GEODE_ROBOT_ID] - newStates.collectedOre) / newStates.oreRobots),
            Math.ceil((bluePrint.obsidianCosts[GEODE_ROBOT_ID] - newStates.collectedObsidian) / newStates.obsidianRobots));

        let timeToWait = Math.min(roundsToWaitToBuildNextOreRobot, roundsToWaitToBuildNextClayRobot,
            roundsToWaitToBuildNextObsidianRobot, roundsToWaitToBuildNextGeodeRobot);
        timeToWait = Math.max(timeToWait, 1);

        for (let i = 0; i < timeToWait; ++i)
            collectResources(newStates);

        doNextStep(newStates, time + timeToWait);
    }
    else {
        nextStates.forEach((state) => {
            doNextStep(state, time + 1);
        });
    }

}

function createRobot(time, id, bluePrint, states) {
    let timeRemaining = MAX_TIME - time;
    let requiredOre = bluePrint.oreCosts[id];
    let requiredClay = bluePrint.clayCosts[id];
    let requiredObsidian = bluePrint.obsidianCosts[id];
    let numOreRobots = states.oreRobots;
    let numClayRobots = states.clayRobots;
    let numObsidianRobots = states.obsidianRobots;
    switch (id) {
        case ORE_ROBOT_ID: {
            if (states.collectedOre >= requiredOre &&
                numOreRobots < 4 &&
                timeRemaining >= 16) {
                states.collectedOre -= requiredOre;
                return true;
            }
            break;
        }
        case CLAY_ROBOT_ID: {
            if (states.collectedOre >= requiredOre &&
                numClayRobots < bluePrint.clayCosts[OBSIDIAN_ROBOT_ID] - 1 &&
                timeRemaining >= 7) {
                states.collectedOre -= requiredOre;
                return true;
            }
            break;
        }
        case OBSIDIAN_ROBOT_ID: {
            if (states.collectedOre >= requiredOre && states.collectedClay >= requiredClay &&
                timeRemaining >= 4 &&
                numObsidianRobots < bluePrint.obsidianCosts[GEODE_ROBOT_ID]) {
                states.collectedOre -= requiredOre;
                states.collectedClay -= requiredClay;
                return true;
            }
            break;
        }
        case GEODE_ROBOT_ID: {
            if (states.collectedOre >= requiredOre && states.collectedObsidian >= requiredObsidian &&
                timeRemaining >= 1) {
                states.collectedOre -= requiredOre;
                states.collectedObsidian -= requiredObsidian;
                return true;
            }
            break;
        }
    }
    return false;
}

function collectResources(states) {
    states.collectedOre += states.oreRobots;
    states.collectedClay += states.clayRobots;
    states.collectedObsidian += states.obsidianRobots;
    states.collectedGeode += states.geodeRobots;
}
