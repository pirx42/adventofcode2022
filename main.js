var fs = require('fs');
var path = require('path');
var filePath = './inputDay18.txt';


let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let max = [0, 0, 0];
let elements = [];
let lines = input.split('\n');
lines.forEach((line) => {
    if (line.length > 0) {
        const regex = /(\S+),(\S+),(\S+)/g;
        let match = regex.exec(line);
        let element = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        max[0] = Math.max(max[0], element[0]);
        max[1] = Math.max(max[1], element[1]);
        max[2] = Math.max(max[2], element[2]);
        elements.push(element);
    }
});

let size = add(max, [1, 1, 1]);
let grid = new Array(size[2]).fill(0);
for (let z = 0; z < size[2]; ++z) {
    grid[z] = new Array(size[1]).fill(0);
    for (let y = 0; y < size[1]; ++y) {
        grid[z][y] = new Array(size[0]).fill(0);
    }
}

elements.forEach((element) => {
    setElementAt(element, 1);
});

let neighbors = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

let numTotalOutsideFaces = 0;
for (let z = 0; z < size[2]; ++z) {
    for (let y = 0; y < size[1]; ++y) {
        for (let x = 0; x < size[0]; ++x) {

            let current = [x, y, z];
            if (elementAt(current) > 0) {
                let outsideFaces = 6;
                neighbors.forEach((neighborOffset) => {
                    let neighbor = add(current, neighborOffset);
                    if (elementAt(neighbor) > 0)
                        --outsideFaces;
                });
                numTotalOutsideFaces += outsideFaces;
            }

        }
    }
}

console.log(numTotalOutsideFaces);

//helper
function elementAt(pos) {
    if (pos[0] < 0 || pos[0] >= size[0] ||
        pos[1] < 0 || pos[1] >= size[1] ||
        pos[2] < 0 || pos[2] >= size[2])
        return -1;
    return grid[pos[2]][pos[1]][pos[0]];
}

function setElementAt(pos, element) {
    if (pos[0] < 0 || pos[0] >= size[0] ||
        pos[1] < 0 || pos[1] >= size[1] ||
        pos[2] < 0 || pos[2] >= size[2])
        return;
    grid[pos[2]][pos[1]][pos[0]] = element;
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}

function sub(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
}

function mul(p, t) {
    return [p[0] * t, p[1] * t, p[2] * t];
}
