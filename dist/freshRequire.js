"use strict";
// https://github.com/hughsk/fresh-require
Object.defineProperty(exports, "__esModule", { value: true });
exports.freshRequire = void 0;
const freshRequire = (file) => {
    const resolvedFile = require.resolve(file);
    const temp = require.cache[resolvedFile];
    delete require.cache[resolvedFile];
    const modified = require(resolvedFile);
    require.cache[resolvedFile] = temp;
    return modified;
};
exports.freshRequire = freshRequire;
//# sourceMappingURL=freshRequire.js.map