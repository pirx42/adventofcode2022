// A / X for Rock, B / Y for Paper, and C / Z for Scissors
// A / X > C / Z
// C / Z > B / Y
// B / Y > A / X

var fs = require('fs');
var path = require('path');
var filePath = './inputDay3.txt';

const caloriesSums = new Array();

let priority = {};
let p = 1;
for (let i = 97; i <= 122; ++i, ++p) {
    priority[String.fromCharCode(i)] = p;
}
for (let i = 65; i <= 90; ++i, ++p) {
    priority[String.fromCharCode(i)] = p;
}

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let lines = buffer.toString().split('\n');

let totalPoints = 0;
for (let i = 0; i < lines.length; ++i) {
    if (lines[i].length > 0 && (i % 3) == 0) {
        let first = lines[i];
        let second = lines[i + 1];
        let third = lines[i + 2];
        let id;
        [...first].forEach((fc) => {
            [...second].forEach((sc) => {
                [...third].forEach((tc) => {
                    if (fc == sc && fc == tc)
                        id = fc;
                });
            });
        });

        totalPoints += priority[id];
    }
};

console.log(totalPoints);

