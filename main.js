var fs = require('fs');
var path = require('path');
var filePath = './inputDay20.txt';


class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
}

//double linked cyclic list
class CyclicList {
    constructor() {
        this.head = null;
    }

    firstNode() {
        return this.head;
    }

    append(data) { //add at end mean before head
        if (this.head == null) {
            this.head = new Node(data);
            this.head.next = this.head;
            this.head.previous = this.head;
            return this.head;
        }
        else {
            let n = new Node(data);
            n.next = this.head;
            let nodeBeforeHead = this.head.previous;
            nodeBeforeHead.next = n;
            n.previous = nodeBeforeHead
            this.head.previous = n;
            n.next = this.head;
            return n;
        }
    }

    move(node, distance) {
        if (distance == 0)
            return;
        let destination = node.previous;
        this.extract(node);
        if (distance > 0) {
            while (distance--)
                destination = destination.next;
        } else {
            while (distance++)
                destination = destination.previous;
        }
        this.insert(node, destination);
    }

    extract(node) {
        let before = node.previous;
        let after = node.next;
        before.next = after;
        after.previous = before;
        if (this.head == node)
            this.head = after;
    }

    insert(node, destination) {
        // insert after destination
        let newBefore = destination;
        let newAfter = destination.next;
        newBefore.next = node;
        node.previous = newBefore;
        newAfter.previous = node;
        node.next = newAfter;
    }

    getNthAfter(node, n) {
        if (n == 0)
            return node;
        let nthNode = node;
        if (n > 0) {
            while (n--)
                nthNode = nthNode.next;
        } else {
            while (n++)
                nthNode = nthNode.previous;
        }
        return nthNode;
    }

    toString() {
        let s = '';
        let current = this.head;
        do {
            s += current.data + ', ';
            current = current.next;
        } while (current != this.head)
        return s;
    }
}


let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

let elementsInInitialOrder = [];
let elementListForMixing = new CyclicList();
let nodeWithValue0 = null;

let lines = input.split('\n');
lines.forEach((line) => {
    if (line.length > 0) {
        let addedNode = elementListForMixing.append(parseInt(line));
        elementsInInitialOrder.push(addedNode);
        if (addedNode.data == 0)
            nodeWithValue0 = addedNode;
    }
});

elementsInInitialOrder.forEach((nodeToMove) => {
    elementListForMixing.move(nodeToMove, nodeToMove.data);
});
console.log(elementListForMixing);

let node1000 = elementListForMixing.getNthAfter(nodeWithValue0, 1000);
let node2000 = elementListForMixing.getNthAfter(nodeWithValue0, 2000);
let node3000 = elementListForMixing.getNthAfter(nodeWithValue0, 3000);
console.log(node1000.data + node2000.data + node3000.data);
