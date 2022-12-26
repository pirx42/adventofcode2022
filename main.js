var fs = require('fs');
var path = require('path');
var filePath = './inputDay25.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let snafuToDecimalDigit = {};
snafuToDecimalDigit['='] = -2;
snafuToDecimalDigit['-'] = -1;
snafuToDecimalDigit['0'] = 0;
snafuToDecimalDigit['1'] = 1;
snafuToDecimalDigit['2'] = 2;

let decimalToSnafuDigit = {};
decimalToSnafuDigit['-2'] = '=';
decimalToSnafuDigit['-1'] = '-';
decimalToSnafuDigit['0'] = '0';
decimalToSnafuDigit['1'] = '1';
decimalToSnafuDigit['2'] = '2';

let sum = '';
input.split('\n').forEach((line) => {
    if (line.length > 0) {
        sum = addSn(sum, line);
    }
});

console.log(sum);

function addSn(a, b) {
    let arrA = [...a];
    let arrB = [...b];
    let minLength = Math.min(arrA.length, arrB.length);
    let result = '';
    let carry = 0;
    let index = 0;
    for (; index < minLength; ++index) {
        let a = 0;
        [a, carry] = addSnDigit(snafuToDecimalDigit[arrA[arrA.length - 1 - index]],
            snafuToDecimalDigit[arrB[arrB.length - 1 - index]],
            carry);
        result = decimalToSnafuDigit[a] + result;
    }
    if (arrA.length < arrB.length) {
        for (; index < arrB.length; ++index) {
            let a = 0;
            [a, carry] = addSnDigit(0, snafuToDecimalDigit[arrB[arrB.length - 1 - index]], carry);
            result = decimalToSnafuDigit[a] + result;
        }
    } else {
        for (; index < arrA.length; ++index) {
            let a = 0;
            [a, carry] = addSnDigit(snafuToDecimalDigit[arrA[arrA.length - 1 - index]], 0, carry);
            result = decimalToSnafuDigit[a] + result;
        }
    }
    if (carry != 0)
        result = decimalToSnafuDigit[carry] + result;
    return result;
}

function addSnDigit(a, b, carry) {
    let r = a + b + carry;
    if (r > 2) {
        carry = 1;
        r -= 5;
    }
    else if (r < -2) {
        carry = -1;
        r += 5;
    }
    else {
        carry = 0;
    }
    return [r, carry];
}

function snafuToDecimal(snafu) {
    let result = 0;
    [...snafu].reverse().forEach((e, index) => {
        result += Math.pow(5, index) * snafuToDecimalDigit[e];
    });
    return result;
}
