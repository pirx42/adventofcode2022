// A / X for Rock, B / Y for Paper, and C / Z for Scissors
// A / X > C / Z
// C / Z > B / Y
// B / Y > A / X

var fs = require('fs');
var path = require('path');
var filePath = './inputDay2.txt';

const caloriesSums = new Array();

let buffer = fs.readFileSync(path.join(__dirname, filePath));

let chosePoints = { 'A': 1, 'X': 1, 'B': 2, 'Y': 2, 'C': 3, 'Z': 3 };
let matchPoints = {
    'AX': 3, 'AY': 6, 'AZ': 0,
    'BX': 0, 'BY': 3, 'BZ': 6,
    'CX': 6, 'CY': 0, 'CZ': 3,
};

let totalPoints = 0;
buffer.toString().split('\n').forEach((element, index) => {
    if (element.length > 0) {
        let elements = element.split(' ');
        let first = elements[0];
        let second = elements[1];
        let currentPoints = chosePoints[second] + matchPoints[first + second];
        totalPoints += currentPoints;
    }
});

console.log(totalPoints);

