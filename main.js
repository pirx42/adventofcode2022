var fs = require('fs');
var path = require('path');
var filePath = './inputDay7.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();


// let testInput = '$ cd /\n\
// $ ls\n\
// dir a\n\
// 14848514 b.txt\n\
// 8504156 c.dat\n\
// dir d\n\
// $ cd a\n\
// $ ls\n\
// dir e\n\
// 29116 f\n\
// 2557 g\n\
// 62596 h.lst\n\
// $ cd e\n\
// $ ls\n\
// 584 i\n\
// $ cd ..\n\
// $ cd ..\n\
// $ cd d\n\
// $ ls\n\
// 4060174 j\n\
// 8033020 d.log\n\
// 5626152 d.ext\n\
// 7214296 k\n';

//parse and build folder tree
let root = { 'parent': null, 'name': '/', 'content': [] };

let currentFolder = root;
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
        // const reCmdLS = /\$ ls/g;
        // let match = reCmdLS.exec(line);
        // if (match) {

        // }

        const reCmdCDX = /\$ cd (\S+)/g;
        match = reCmdCDX.exec(line);
        if (match) {
            if (match[1] == '/')
                currentFolder = root;
            else if (match[1] == '..')
                currentFolder = folderUp(currentFolder);
            else
                currentFolder = folderDown(currentFolder, match[1]);
        }

        const reDIRX = /dir (\S+)/g;
        match = reDIRX.exec(line);
        if (match) {
            addSubFolder(currentFolder, match[1]);
        }

        const reFILEX = /(\d+) (\S+)/g;
        match = reFILEX.exec(line);
        if (match) {
            addFile(currentFolder, match[2], parseInt(match[1]));
        }
    }
});


updateContentsSize(root);

let sum = 0;
sumupSmallSizedFolder(root);
console.log(sum);


function sumupSmallSizedFolder(folder) {
    folder.content.forEach((element) => {
        if (element.hasOwnProperty('parent'))
            sumupSmallSizedFolder(element);
    });

    if (folder.size < 100000)
        sum += folder.size;
}


function updateContentsSize(folder) {
    folder.content.forEach((element) => {
        if (element.hasOwnProperty('parent'))
            updateContentsSize(element);
    });

    let folderSize = 0;
    folder.content.forEach((element) => { folderSize += element.size; });
    folder.size = folderSize;
}


function folderUp(folder) {
    return folder.parent;
}

function folderDown(folder, name) {
    return folder.content.find((element) => { return element.name == name; });
}

function addSubFolder(folder, name) {
    let subFolder = { 'parent': folder, 'name': name, 'size': 0, 'content': [] };
    folder.content.push(subFolder);
    return subFolder;
}

function addFile(folder, name, size) {
    folder.content.push({ 'name': name, 'size': size });
}


