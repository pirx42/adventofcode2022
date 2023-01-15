var fs = require('fs');
var path = require('path');
var filePath = './inputDay06.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let lastCharacters = new Array(4).fill(' ');
let currentIndex = 0;
[...input].every((c) => {
    lastCharacters[currentIndex++ % lastCharacters.length] = c;
    let characterSet = new Set();
    [...lastCharacters].forEach((e) => characterSet.add(e));
    if (currentIndex > 3 && characterSet.size == lastCharacters.length)
        return false;
    return true;
});

console.log(currentIndex);
