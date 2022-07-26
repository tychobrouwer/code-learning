"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFromMinMax = exports.randomFromArray = void 0;
function randomFromArray(propbabilityArray) {
    return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}
exports.randomFromArray = randomFromArray;
function randomFromMinMax(min, max) {
    return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}
exports.randomFromMinMax = randomFromMinMax;
//# sourceMappingURL=helper.js.map