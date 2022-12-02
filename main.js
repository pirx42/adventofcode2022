
var fs = require('fs');
var path = require('path');
var filePath = './inputDay1.txt';

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

console.log(caloriesSums[0] + caloriesSums[1] + caloriesSums[2]);



// const intputUrl = 'https://adventofcode.com/2022/day/1/input';
// const https = require('https')
// https.get(intputUrl, res => {
//     let data = '';
//     res.on('data', chunk => {
//         data += chunk;
//     });
//     res.on('end', () => {
//         // data = JSON.parse(data);
//         console.log(data);
//     })
// }).on('error', err => {
//     console.log(err.message);
// }).end()

