var fs = require('fs');
var path = require('path');
var filePath = './inputDay03.txt';

const caloriesSums = new Array();

let buffer = fs.readFileSync(path.join(__dirname, filePath));

let priority = {};
let p = 1;
for (let i = 97; i <= 122; ++i, ++p) {
    priority[String.fromCharCode(i)] = p;
}
for (let i = 65; i <= 90; ++i, ++p) {
    priority[String.fromCharCode(i)] = p;
}

let totalPoints = 0;
buffer.toString().split('\n').forEach((element, index) => {
    if (element.length > 0) {
        let first = element.slice(0, element.length / 2);
        let second = element.slice(element.length / 2, element.length);
        let duplicate;
        [...first].forEach((fc) => {
            [...second].forEach((sc) => {
                if (fc == sc)
                    duplicate = fc;
            });
        });

        totalPoints += priority[duplicate];
    }
});

console.log(totalPoints);

