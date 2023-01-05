var fs = require('fs');
var path = require('path');
var filePath = './inputDay21.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let monkeys = {};

let lines = input.split('\n');
lines.forEach((line) => {
    if (line.length > 0) {
        const reOp = /(\S+): (\S+) ([\+\-\/\*]) (\S+)/g;
        const reNumber = /(\S+): (\S+)/g;
        let matchOp = reOp.exec(line);
        let matchNumber = reNumber.exec(line);
        if (matchOp) {
            let monkey = { id: matchOp[1], inputA: matchOp[2], inputB: matchOp[4] };
            eval('monkey.evalutate = function () { return this.inputA.evalutate() ' + matchOp[3] + ' this.inputB.evalutate() }');
            monkeys[matchOp[1]] = monkey;
        }
        else if (matchNumber) {
            let monkey = { id: matchNumber[1] };
            eval('monkey.evalutate = function () { return ' + matchNumber[2] + ' }');
            monkeys[matchNumber[1]] = monkey;
        }
    }
});


Object.keys(monkeys).forEach((key) => {
    let monkey = monkeys[key];
    if (monkey.hasOwnProperty('inputA'))
        monkey.inputA = monkeys[monkey.inputA];
    if (monkey.hasOwnProperty('inputB'))
        monkey.inputB = monkeys[monkey.inputB];
});


console.log(monkeys['root'].evalutate());
