
var fs = require('fs');
var path = require('path');
var filePath = './inputDay01.txt';

const caloriesSums = new Array();

let buffer = fs.readFileSync(path.join(__dirname, filePath));

let currentCalories = 0;
buffer.toString().split('\n').forEach((element, index) => {
    if (element.length == 0) {
        caloriesSums.push(currentCalories);
        currentCalories = 0;
    }
    else {
        currentCalories += parseInt(element);
    }
});

caloriesSums.sort((lhs, rhs) => parseInt(rhs) - parseInt(lhs));

console.log(caloriesSums[0]);
