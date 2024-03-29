var fs = require('fs');
var path = require('path');
var filePath = './inputDay07.txt';

let buffer = fs.readFileSync(path.join(__dirname, filePath));
let input = buffer.toString();

//parse and build folder tree
let root = { 'parent': null, 'name': '/', 'content': [] };

let currentFolder = root;
input.split('\n').forEach((line, index) => {
    if (line.length > 0) {
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

let orderedFoldersBySize = new Array();
flattenFolder(root);
orderedFoldersBySize.sort((a, b) => a.size - b.size);

let requiredSize = 30000000;
let unusedSpace = 70000000 - root.size;
let minimumSpaceToFree = requiredSize - unusedSpace;

orderedFoldersBySize.every((folder) => {
    if (folder.size >= minimumSpaceToFree) {
        console.log(folder.size);
        return false;
    }
    return true;
})


function flattenFolder(folder) {
    folder.content.forEach((element) => {
        if (element.hasOwnProperty('parent'))
            flattenFolder(element);
    });

    orderedFoldersBySize.push(folder);
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


