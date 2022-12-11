const addOp = 0;
const mulOp = 1;
const squareOp = 2;

let monkeys = [
    createMonkey([83n, 88n, 96n, 79n, 86n, 88n, 70n], mulOp, 5n, 11n, 2, 3),
    createMonkey([59n, 63n, 98n, 85n, 68n, 72n], mulOp, 11n, 5n, 4, 0),
    createMonkey([90n, 79n, 97n, 52n, 90n, 94n, 71n, 70n], addOp, 2n, 19n, 5, 6),
    createMonkey([97n, 55n, 62n], addOp, 5n, 13n, 2, 6),
    createMonkey([74n, 54n, 94n, 76n], squareOp, 0n, 7n, 0, 3),
    createMonkey([58n], addOp, 4n, 17n, 7, 1),
    createMonkey([66n, 63n], addOp, 6n, 2n, 7, 5),
    createMonkey([56n, 56n, 90n, 96n, 68n], addOp, 7n, 3n, 4, 1),
];


let primesLCM = 2n * 3n * 5n * 7n * 11n * 13n * 17n * 19n * 23n;
for (let round = 0; round < 10000; ++round) {
    monkeys.forEach(monkey => processMonkey(monkey));
}


monkeys.sort((a, b) => b.inspectedItems - a.inspectedItems);

console.log(monkeys[0].inspectedItems * monkeys[1].inspectedItems);


function processMonkey(monkey) {
    while (monkey.items.length > 0) {
        ++monkey.inspectedItems;
        let item = monkey.items.shift();
        if (monkey.operation === addOp)
            item += monkey.operand;
        else if (monkey.operation === mulOp)
            item *= monkey.operand;
        else if (monkey.operation === squareOp)
            item *= item;

        item %= primesLCM;

        if (item % monkey.testValue == 0)
            monkeys[monkey.trueTarget].items.push(item);
        else
            monkeys[monkey.falseTarget].items.push(item);
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
