var fs = require('fs');
var path = require('path');
var filePath = './inputDay8.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

// let testInput = '30373\n\
// 25512\n\
// 65332\n\
// 33549\n\
// 35390\n';

let treeGrid = [];
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        treeGrid.push([...line]);
    }
});

let gridWidth = treeGrid[0].length;
let gridHeight = treeGrid.length;

let maxViewingScore = 0;
for (let row = 0; row < gridHeight; ++row) {
    for (let column = 0; column < gridWidth; ++column) {
        calcViewingScore(column, row);
    }
}

console.log(maxViewingScore);


function calcViewingScore(column, row) {
    let distanceToLeft = 0;
    for (let c = column - 1; c >= 0; --c) {
        ++distanceToLeft;
        if (treeGrid[row][c] >= treeGrid[row][column])
            break;
    }

    let distanceToRight = 0;
    for (let c = column + 1; c < gridWidth; ++c) {
        ++distanceToRight;
        if (treeGrid[row][c] >= treeGrid[row][column])
            break;
    }

    let distanceToTop = 0;
    for (let r = row - 1; r >= 0; --r) {
        ++distanceToTop;
        if (treeGrid[r][column] >= treeGrid[row][column])
            break;
    }

    let distanceToBottom = 0;
    for (let r = row + 1; r < gridHeight; ++r) {
        ++distanceToBottom;
        if (treeGrid[r][column] >= treeGrid[row][column])
            break;
    }

    maxViewingScore = Math.max(distanceToLeft * distanceToRight * distanceToTop * distanceToBottom, maxViewingScore);
}
