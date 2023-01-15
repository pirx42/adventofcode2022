var fs = require('fs');
var path = require('path');
var filePath = './inputDay12.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let heightMap = [];
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        heightMap.push([...line]);
    }
});

let start = [0, 0];
let destination = [0, 0];
let distanceMap = new Array(heightMap.length);

for (let y = 0; y < heightMap.length; ++y) {
    for (let x = 0; x < heightMap[0].length; ++x) {
        if (heightMap[y][x] == 'S') {
            start = [x, y];
            heightMap[y][x] = 'a';
        }
        else if (heightMap[y][x] == 'E') {
            destination = [x, y];
            heightMap[y][x] = 'z';
        }
        heightMap[y][x] = heightMap[y][x].charCodeAt() - 97;
    }
    distanceMap[y] = new Array(heightMap[0].length).fill(99999);
}


const neighbors = [[1, 0], [0, 1], [-1, 0], [0, -1]];

updateDistancesOfNeighbors(start, 0);
console.log(distanceAt(destination));


function updateDistancesOfNeighbors(current, distance) {
    distanceMap[current[1]][current[0]] = distance;

    if (equal(current, destination))
        return;

    for (let i = 0; i < neighbors.length; ++i) {
        let next = add(current, neighbors[i]);
        if (levelAt(next) > levelAt(current) + 1)
            continue;
        if (distanceAt(next) <= distance + 1)
            continue;
        updateDistancesOfNeighbors(next, distance + 1);
    }
}

function levelAt(pos) {
    if (pos[0] < 0 || pos[0] >= heightMap[0].length ||
        pos[1] < 0 || pos[1] >= heightMap.length)
        return -1;
    return heightMap[pos[1]][pos[0]];
}

function distanceAt(pos) {
    if (pos[0] < 0 || pos[0] >= distanceMap[0].length ||
        pos[1] < 0 || pos[1] >= distanceMap.length)
        return 0;
    return distanceMap[pos[1]][pos[0]];
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function equal(p1, p2) {
    return p1[0] == p2[0] && p1[1] == p2[1];
}