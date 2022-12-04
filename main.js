var fs = require('fs');
var path = require('path');
var filePath = './inputDay4.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let lines = buffer.toString().split('\n');

let totalPoints = 0;
lines.forEach((line, index) => {
    if (line.length > 0) {
        const regexp = /(\d+)-(\d+),(\d+)-(\d+)/g;
        const match = regexp.exec(line);
        let firstCompletelyInsideSecond = parseInt(match[1]) >= parseInt(match[3]) && parseInt(match[2]) <= parseInt(match[4]);
        let secondCompletelyInsideFirst = parseInt(match[1]) <= parseInt(match[3]) && parseInt(match[2]) >= parseInt(match[4]);
        let secondBeginInsideFirst = parseInt(match[1]) <= parseInt(match[3]) && parseInt(match[2]) >= parseInt(match[3]);
        let secondEndInsideFirst = parseInt(match[1]) <= parseInt(match[4]) && parseInt(match[2]) >= parseInt(match[4]);

        if (firstCompletelyInsideSecond || secondCompletelyInsideFirst || secondBeginInsideFirst || secondEndInsideFirst)
            ++totalPoints;
    }
});

console.log(totalPoints);

