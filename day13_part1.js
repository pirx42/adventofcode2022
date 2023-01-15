var fs = require('fs');
var path = require('path');
var filePath = './inputDay13.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let summedIndices = 0;
let lines = input.split('\n');
for (let i = 0; i < lines.length; i += 3) {
    if (lines[0].length == 0)
        break;

    let first = JSON.parse(lines[i]);
    let second = JSON.parse(lines[i + 1]);
    if (isRightOrder(first, second) <= 0) {
        summedIndices += Math.trunc(i / 3 + 1);
    }
}

console.log(summedIndices);

function isRightOrder(lhs, rhs) {
    if (Number.isInteger(lhs) && Number.isInteger(rhs)) {
        return lhs - rhs;
    }
    else if (Array.isArray(lhs) && Array.isArray(rhs)) {
        for (let i = 0; i < Math.max(lhs.length, rhs.length); ++i) {
            if (i >= lhs.length && i < rhs.length)
                return -1;
            if (i < lhs.length && i >= rhs.length)
                return 1;

            let result = isRightOrder(lhs[i], rhs[i]);
            if (result < 0)
                return -1;
            else if (result > 0)
                return 1;
        }
        return 0;
    }
    else if (Number.isInteger(lhs)) {
        return isRightOrder([lhs], rhs);
    }
    else if (Number.isInteger(rhs)) {
        return isRightOrder(lhs, [rhs]);
    }
    return 0;
}
