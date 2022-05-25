const fs = jest.createMockFromModule('fs') as any;

let readFileSyncResult = Object.create(null);
function __readFileSyncSetter(json: Record<string, string>) {
    readFileSyncResult = json;
}

function readFileSync(_path: string): Buffer {
    return Buffer.from(JSON.stringify(readFileSyncResult));
}

fs.__readFileSyncSetter = __readFileSyncSetter;
fs.readFileSync = readFileSync;

module.exports = fs;