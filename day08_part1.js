var fs = require('fs');
var path = require('path');
var filePath = './inputDay08.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let treeGrid = [];
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        treeGrid.push([...line]);
    }
});

let gridWidth = treeGrid[0].length;
let gridHeight = treeGrid.length;

let numVisibleTrees = 0;
for (let row = 1; row < gridHeight - 1; ++row) {
    for (let column = 1; column < gridWidth - 1; ++column) {
        if (isTreeVisible(column, row))
            ++numVisibleTrees;
    }
}

console.log(gridWidth * 2 + (gridHeight - 2) * 2 + numVisibleTrees);



function isTreeVisible(column, row) {
    let visibleToLeft = true;
    for (let c = 0; c < column; ++c) {
        if (treeGrid[row][c] >= treeGrid[row][column]) {
            visibleToLeft = false;
            break;
        }
    }
    if (visibleToLeft)
        return true;

    let visibleToRight = true;
    for (let c = column + 1; c < gridHeight; ++c) {
        if (treeGrid[row][c] >= treeGrid[row][column]) {
            visibleToRight = false;
            break;
        }
    }
    if (visibleToRight)
        return true;

    let visibleToTop = true;
    for (let r = 0; r < row; ++r) {
        if (treeGrid[r][column] >= treeGrid[row][column]) {
            visibleToTop = false;
            break;
        }
    }
    if (visibleToTop)
        return true;

    let visibleToBottom = true;
    for (let r = row + 1; r < gridHeight; ++r) {
        if (treeGrid[r][column] >= treeGrid[row][column]) {
            visibleToBottom = false;
            break;
        }
    }
    return visibleToBottom;
}