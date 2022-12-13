var fs = require('fs');
var path = require('path');
var filePath = './inputDay13.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let lines = input.split('\n');
let dividerPacketA = [[2]];
let dividerPacketB = [[6]];
let packets = [dividerPacketA, dividerPacketB];

for (let i = 0; i < lines.length; i += 3) {
    if (lines[0].length == 0)
        break;

    packets.push(JSON.parse(lines[i]));
    packets.push(JSON.parse(lines[i + 1]));
}

packets.sort((a, b) => compareOrder(a, b));

let idxA = packets.findIndex((element) => element == dividerPacketA);
let idxB = packets.findIndex((element) => element == dividerPacketB);
console.log((idxA + 1) * (idxB + 1));


// right order: <=0
// not right order: >0
function compareOrder(lhs, rhs) {
    if (Number.isInteger(lhs) && Number.isInteger(rhs)) {
        return lhs - rhs;
    }
    else if (Array.isArray(lhs) && Array.isArray(rhs)) {
        for (let i = 0; i < Math.max(lhs.length, rhs.length); ++i) {
            if (i >= lhs.length && i < rhs.length)
                return -1;
            if (i < lhs.length && i >= rhs.length)
                return 1;

            let result = compareOrder(lhs[i], rhs[i]);
            if (result < 0)
                return -1;
            else if (result > 0)
                return 1;
        }
        return 0;
    }
    else if (Number.isInteger(lhs)) {
        return compareOrder([lhs], rhs);
    }
    else if (Number.isInteger(rhs)) {
        return compareOrder(lhs, [rhs]);
    }
    return 0;
}