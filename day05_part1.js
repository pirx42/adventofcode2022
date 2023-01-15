var fs = require('fs');
var path = require('path');
var filePath = './inputDay05.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let lines = buffer.toString().split('\n');

let numStacks = 9;
let stackHeight = 8;
let stacks = new Array(numStacks);
for (let i = 0; i < stacks.length; ++i) {
    stacks[i] = new Array();
}


//read stack state
let currentLine = 0;
for (let i = 0; i < stackHeight; ++i) {
    for (let stackIdx = 0; stackIdx < numStacks; ++stackIdx) {
        let crate = lines[i][1 + stackIdx * 4];
        if (crate != ' ')
            putCrateToFront(stacks[stackIdx], crate);
    }
};

//read and process instructions
for (let currentLine = stackHeight + 2; currentLine < lines.length; ++currentLine) {
    let line = lines[currentLine];
    if (line.length == 0)
        break;

    //move 1 from 5 to 2
    const regexp = /move (\d+) from (\d+) to (\d+)/g;
    const match = regexp.exec(line);
    for (let i = 0; i < match[1]; ++i) {
        let crate = takeCrate(stacks[match[2] - 1]);
        putCrate(stacks[match[3] - 1], crate);
    }
};

//final result
let topCrates = '';
for (let i = 0; i < stacks.length; ++i) {
    topCrates += (takeCrate(stacks[i]));
}

console.log(topCrates);


//helper
function takeCrate(stack) {
    if (stack.length <= 0)
        return '';
    return stack.pop();
}

function putCrate(stack, create) {
    stack.push(create);
}

function putCrateToFront(stack, create) {
    stack.unshift(create);
}
