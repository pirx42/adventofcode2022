var fs = require('fs');
var path = require('path');
var filePath = './inputDay06.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const lengthOfMarker = 14;
let lastCharacters = new Array(lengthOfMarker).fill(' ');
let currentIndex = 0;
[...input].every((c) => {
    lastCharacters[currentIndex++ % lastCharacters.length] = c;
    return currentIndex <= lengthOfMarker - 1 || new Set(lastCharacters).size != lastCharacters.length;
});

console.log(currentIndex);
