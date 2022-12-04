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
        let firstInsideSecond = parseInt(match[1]) >= parseInt(match[3]) && parseInt(match[2]) <= parseInt(match[4]);
        let secondInsideFirst = parseInt(match[1]) <= parseInt(match[3]) && parseInt(match[2]) >= parseInt(match[4]);

        if (firstInsideSecond || secondInsideFirst)
            ++totalPoints;
    }
});

console.log(totalPoints);

