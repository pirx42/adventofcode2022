var fs = require('fs');
var path = require('path');
var filePath = './inputDay21.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

const humanId = 'humn';
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
            eval('monkey.evaluate = function () { return this.inputA.evaluate() ' + matchOp[3] + ' this.inputB.evaluate() }');

            switch (matchOp[3]) {
                case '+':
                    monkey.set = function (val) {
                        let humanInSubtreeA = findMonkey(this.inputA, humanId);
                        if (humanInSubtreeA)
                            this.inputA.set(val - this.inputB.evaluate());
                        else
                            this.inputB.set(val - this.inputA.evaluate());
                    }
                    break;
                case '-':
                    monkey.set = function (val) {
                        let humanInSubtreeA = findMonkey(this.inputA, humanId);
                        if (humanInSubtreeA)
                            this.inputA.set(val + this.inputB.evaluate());
                        else
                            this.inputB.set(this.inputA.evaluate() - val);
                    }
                    break;
                case '/':
                    monkey.set = function (val) {
                        let humanInSubtreeA = findMonkey(this.inputA, humanId);
                        if (humanInSubtreeA)
                            this.inputA.set(val * this.inputB.evaluate());
                        else
                            this.inputB.set(this.inputA.evaluate() / val);
                    }
                    break;
                case '*':
                    monkey.set = function (val) {
                        let humanInSubtreeA = findMonkey(this.inputA, humanId);
                        if (humanInSubtreeA)
                            this.inputA.set(val / this.inputB.evaluate());
                        else
                            this.inputB.set(val / this.inputA.evaluate());
                    }
                    break;
            };

            monkeys[matchOp[1]] = monkey;
        }
        else if (matchNumber) {
            let monkey = { id: matchNumber[1] };
            eval('monkey.evaluate = function () { return ' + matchNumber[2] + ' }');
            if (matchNumber[1] == humanId) {
                monkey.value = -1;
                monkey.set = function (val) { this.value = val; };
            }
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


let rootInputA = monkeys['root'].inputA;
let rootInputB = monkeys['root'].inputB;

let humanInSubtreeA = findMonkey(rootInputA, humanId);
let humanInSubtreeB = findMonkey(rootInputB, humanId);

if (humanInSubtreeA) {
    rootInputA.set(rootInputB.evaluate());
    console.log(humanInSubtreeA.value);
}
else {
    rootInputB.set(rootInputA.evaluate());
    console.log(humanInSubtreeB.value);
}

//helper
function findMonkey(monkey, id) {
    if (monkey == null)
        return null;
    if (monkey.id == id)
        return monkey;
    let foundMonkeyInSubTreeA = findMonkey(monkey.inputA, id);
    if (foundMonkeyInSubTreeA)
        return foundMonkeyInSubTreeA;
    let foundMonkeyInSubTreeB = findMonkey(monkey.inputB, id);
    if (foundMonkeyInSubTreeB)
        return foundMonkeyInSubTreeB;
    return null;
}

