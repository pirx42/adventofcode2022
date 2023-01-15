var fs = require('fs');
var path = require('path');

const addOp = 'addOp';
const mulOp = 'mulOp';
const squareOp = 'squareOp';

let monkeys = [
    createMonkey([83, 88, 96, 79, 86, 88, 70], mulOp, 5, 11, 2, 3),
    createMonkey([59, 63, 98, 85, 68, 72], mulOp, 11, 5, 4, 0),
    createMonkey([90, 79, 97, 52, 90, 94, 71, 70], addOp, 2, 19, 5, 6),
    createMonkey([97, 55, 62], addOp, 5, 13, 2, 6),
    createMonkey([74, 54, 94, 76], squareOp, 0, 7, 0, 3),
    createMonkey([58], addOp, 4, 17, 7, 1),
    createMonkey([66, 63], addOp, 6, 2, 7, 5),
    createMonkey([56, 56, 90, 96, 68], addOp, 7, 3, 4, 1),
];

for (let round = 0; round < 20; ++round) {
    monkeys.forEach(monkey => processMonkey(monkey));
}

monkeys.sort((a, b) => b.inspectedItems - a.inspectedItems);

console.log(monkeys[0].inspectedItems * monkeys[1].inspectedItems);


function processMonkey(monkey) {
    while (monkey.items.length > 0) {
        ++monkey.inspectedItems;
        let item = monkey.items.shift();
        let worryLevel = 0;
        if (monkey.operation == addOp)
            worryLevel = item + monkey.operand;
        else if (monkey.operation == mulOp)
            worryLevel = item * monkey.operand;
        else if (monkey.operation == squareOp)
            worryLevel = item * item;

        worryLevel = Math.trunc(worryLevel / 3);

        if (worryLevel % monkey.testValue == 0)
            monkeys[monkey.trueTarget].items.push(worryLevel);
        else
            monkeys[monkey.falseTarget].items.push(worryLevel);
    }
}

function createMonkey(items, operation, operand, testValue, trueTarget, falseTarget) {
    return {
        'items': items,
        'operation': operation,
        'operand': operand,
        'testValue': testValue,
        'trueTarget': trueTarget,
        'falseTarget': falseTarget,
        'inspectedItems': 0,
    }
}
